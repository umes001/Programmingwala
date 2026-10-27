import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Clock,
  User,
  Globe,
  Lock
} from 'lucide-react';

const NoteSection = ({ lessonId, courseId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    content: '',
    timestamp: 0,
    isPublic: false
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [lessonId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lms/lessons/${lessonId}/notes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotes(data.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.content.trim()) return;
    
    try {
      const response = await fetch(`/api/lms/lessons/${lessonId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newNote)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotes([data.data, ...notes]);
        setNewNote({
          content: '',
          timestamp: 0,
          isPublic: false
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.content.trim()) return;
    
    try {
      const response = await fetch(`/api/lms/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: editingNote.content,
          isPublic: editingNote.isPublic
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotes(notes.map(note => 
          note._id === editingNote._id ? data.data : note
        ));
        setEditingNote(null);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const response = await fetch(`/api/lms/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotes(notes.filter(note => note._id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const formatTimestamp = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-gray-600">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Lesson Notes
          </h3>
          <p className="text-gray-600">
            Add personal notes or view shared notes from other students
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </button>
      </div>

      {/* New Note Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-gray-50 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">New Note</h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewNote({
                    content: '',
                    timestamp: 0,
                    isPublic: false
                  });
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Write your note here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <input
                    type="number"
                    value={newNote.timestamp}
                    onChange={(e) => setNewNote({ ...newNote, timestamp: parseInt(e.target.value) || 0 })}
                    placeholder="Timestamp (seconds)"
                    className="w-32 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNote.isPublic}
                    onChange={(e) => setNewNote({ ...newNote, isPublic: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                    newNote.isPublic ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                      newNote.isPublic ? 'translate-x-4' : ''
                    }`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700">
                    {newNote.isPublic ? 'Public' : 'Private'}
                  </span>
                </label>
              </div>
              
              <button
                onClick={handleCreateNote}
                className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No notes yet
            </h4>
            <p className="text-gray-600">
              Add your first note to start capturing important points
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              {editingNote?._id === note._id ? (
                <div>
                  <textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingNote.isPublic}
                          onChange={(e) => setEditingNote({ ...editingNote, isPublic: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                          editingNote.isPublic ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                            editingNote.isPublic ? 'translate-x-4' : ''
                          }`}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700">
                          {editingNote.isPublic ? 'Public' : 'Private'}
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingNote(null)}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateNote}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Note Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTimestamp(note.timestamp)}
                      </div>
                      
                      <div className="flex items-center text-sm">
                        {note.isPublic ? (
                          <>
                            <Globe className="w-4 h-4 mr-1 text-blue-500" />
                            <span className="text-blue-600">Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-1 text-gray-500" />
                            <span className="text-gray-600">Private</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingNote(note)}
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit note"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Note Content */}
                  <div className="prose max-w-none text-gray-700 mb-3">
                    {note.content.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                  
                  {/* Note Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>You</span>
                    </div>
                    
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteSection;