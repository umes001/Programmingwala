import { Server } from 'socket.io';

// Map of online users: socket.id -> { socketId, username, avatar, status, gameType, roomId, wins }
const onlineUsers = new Map();

// Map of active rooms: roomId -> { roomId, gameType, maxPlayers, hostId, players: [], gameState: {} }
const activeRooms = new Map();

export function setupGameSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  const broadcastOnlineUsers = () => {
    const userList = Array.from(onlineUsers.values());
    io.emit('online_users_updated', userList);
  };

  io.on('connection', (socket) => {
    console.log(`\x1b[36m[GAME SOCKET] Client connected:\x1b[0m ${socket.id}`);

    // ── 1. JOIN LOBBY & REGISTER PRESENCE ──
    socket.on('join_lobby', (userData) => {
      const user = {
        socketId: socket.id,
        username: userData.username || `Player_${socket.id.substring(0, 4)}`,
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        status: 'Online',
        gameType: null,
        roomId: null,
        wins: userData.wins || 0,
        level: userData.level || 1,
        joinedAt: Date.now()
      };
      onlineUsers.set(socket.id, user);
      broadcastOnlineUsers();
    });

    // ── 2. DIRECT PLAYER CHALLENGE SYSTEM ──
    socket.on('send_challenge', ({ targetSocketId, gameType, challengerInfo }) => {
      const targetUser = onlineUsers.get(targetSocketId);
      const challenger = onlineUsers.get(socket.id) || challengerInfo;

      if (targetUser && targetUser.status === 'Online') {
        io.to(targetSocketId).emit('incoming_challenge', {
          challengerSocketId: socket.id,
          challengerName: challenger.username,
          challengerAvatar: challenger.avatar,
          gameType: gameType || 'Ludo',
          timestamp: Date.now()
        });
      } else {
        socket.emit('challenge_failed', { message: 'Player is currently busy or offline.' });
      }
    });

    socket.on('accept_challenge', ({ challengerSocketId, gameType }) => {
      const challenger = onlineUsers.get(challengerSocketId);
      const accepter = onlineUsers.get(socket.id);

      if (!challenger || !accepter) {
        return socket.emit('challenge_failed', { message: 'Opponent disconnected.' });
      }

      // Generate Room ID
      const roomId = `MATCH-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create Room
      const room = {
        roomId,
        gameType: gameType || 'Ludo',
        maxPlayers: 2,
        hostId: challengerSocketId,
        players: [
          { socketId: challenger.socketId, username: challenger.username, avatar: challenger.avatar, color: 'red', isHost: true },
          { socketId: accepter.socketId, username: accepter.username, avatar: accepter.avatar, color: 'green', isHost: false }
        ],
        gameState: {
          currentTurn: challenger.socketId,
          board: null,
          status: 'playing'
        },
        createdAt: Date.now()
      };

      activeRooms.set(roomId, room);

      // Join sockets into room
      socket.join(roomId);
      const challengerSocket = io.sockets.sockets.get(challengerSocketId);
      if (challengerSocket) challengerSocket.join(roomId);

      // Update users status
      challenger.status = 'In Game';
      challenger.roomId = roomId;
      challenger.gameType = gameType;

      accepter.status = 'In Game';
      accepter.roomId = roomId;
      accepter.gameType = gameType;

      broadcastOnlineUsers();

      // Emit start to both players
      io.to(roomId).emit('game_match_started', {
        roomId,
        gameType: room.gameType,
        players: room.players,
        currentTurn: room.players[0].socketId,
        gameState: room.gameState
      });
    });

    socket.on('decline_challenge', ({ challengerSocketId, reason }) => {
      const accepter = onlineUsers.get(socket.id);
      io.to(challengerSocketId).emit('challenge_declined', {
        declinerName: accepter?.username || 'Player',
        reason: reason || 'Declined the match invitation.'
      });
    });

    // ── 3. PRIVATE ROOM CODE CREATION & JOINING ──
    socket.on('create_room', ({ gameType, maxPlayers, hostInfo }) => {
      const user = onlineUsers.get(socket.id) || hostInfo;
      const roomCode = `${gameType.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const colors = ['red', 'green', 'yellow', 'blue'];

      const room = {
        roomId: roomCode,
        gameType: gameType || 'Ludo',
        maxPlayers: maxPlayers || 4,
        hostId: socket.id,
        players: [
          { socketId: socket.id, username: user.username, avatar: user.avatar, color: colors[0], isHost: true }
        ],
        gameState: {
          currentTurn: socket.id,
          status: 'waiting'
        },
        createdAt: Date.now()
      };

      activeRooms.set(roomCode, room);
      socket.join(roomCode);

      if (user) {
        user.status = 'In Room';
        user.roomId = roomCode;
        user.gameType = gameType;
      }
      broadcastOnlineUsers();

      socket.emit('room_created', {
        roomCode,
        room
      });
    });

    socket.on('join_room', ({ roomCode, playerInfo }) => {
      const cleanCode = (roomCode || '').trim().toUpperCase();
      const room = activeRooms.get(cleanCode);
      const user = onlineUsers.get(socket.id) || playerInfo;

      if (!room) {
        return socket.emit('join_room_error', { message: `Room "${cleanCode}" does not exist.` });
      }

      if (room.players.length >= room.maxPlayers) {
        return socket.emit('join_room_error', { message: `Room "${cleanCode}" is already full.` });
      }

      const colors = ['red', 'green', 'yellow', 'blue'];
      const assignedColor = colors[room.players.length % colors.length];

      room.players.push({
        socketId: socket.id,
        username: user.username,
        avatar: user.avatar,
        color: assignedColor,
        isHost: false
      });

      socket.join(cleanCode);

      if (user) {
        user.status = 'In Room';
        user.roomId = cleanCode;
        user.gameType = room.gameType;
      }
      broadcastOnlineUsers();

      // Notify all members of updated room
      io.to(cleanCode).emit('room_updated', { room });
    });

    socket.on('start_room_game', ({ roomCode }) => {
      const room = activeRooms.get(roomCode);
      if (room && room.hostId === socket.id) {
        room.gameState.status = 'playing';
        io.to(roomCode).emit('game_match_started', {
          roomId: roomCode,
          gameType: room.gameType,
          players: room.players,
          currentTurn: room.players[0].socketId,
          gameState: room.gameState
        });
      }
    });

    // ── 4. REAL-TIME GAME MOVES & STATE BROADCAST ──
    socket.on('game_move', ({ roomId, moveData }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        // Broadcast move to all opponents in the room
        socket.to(roomId).emit('opponent_moved', {
          senderSocketId: socket.id,
          moveData
        });
      }
    });

    socket.on('sync_game_state', ({ roomId, gameState }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        room.gameState = { ...room.gameState, ...gameState };
        socket.to(roomId).emit('game_state_synced', { gameState });
      }
    });

    socket.on('send_quick_chat', ({ roomId, message, emoji }) => {
      const sender = onlineUsers.get(socket.id);
      io.to(roomId).emit('quick_chat_received', {
        senderSocketId: socket.id,
        senderName: sender?.username || 'Player',
        message,
        emoji,
        timestamp: Date.now()
      });
    });

    socket.on('rematch_request', ({ roomId }) => {
      const sender = onlineUsers.get(socket.id);
      socket.to(roomId).emit('rematch_offered', {
        senderName: sender?.username || 'Opponent'
      });
    });

    socket.on('rematch_accept', ({ roomId }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        io.to(roomId).emit('game_rematch_started', {
          roomId,
          gameType: room.gameType,
          players: room.players,
          currentTurn: room.players[Math.floor(Math.random() * room.players.length)].socketId
        });
      }
    });

    socket.on('leave_game', ({ roomId }) => {
      socket.leave(roomId);
      const user = onlineUsers.get(socket.id);
      if (user) {
        user.status = 'Online';
        user.roomId = null;
        user.gameType = null;
      }
      socket.to(roomId).emit('opponent_left', {
        message: `${user?.username || 'Player'} has left the match.`
      });
      broadcastOnlineUsers();
    });

    // ── 5. DISCONNECT CLEANUP ──
    socket.on('disconnect', () => {
      console.log(`\x1b[33m[GAME SOCKET] Client disconnected:\x1b[0m ${socket.id}`);
      const user = onlineUsers.get(socket.id);
      if (user && user.roomId) {
        socket.to(user.roomId).emit('opponent_left', {
          message: `${user.username} disconnected.`
        });
        const room = activeRooms.get(user.roomId);
        if (room) {
          room.players = room.players.filter(p => p.socketId !== socket.id);
          if (room.players.length === 0) {
            activeRooms.delete(user.roomId);
          }
        }
      }
      onlineUsers.delete(socket.id);
      broadcastOnlineUsers();
    });
  });

  return io;
}
