import express from 'express';
import Meeting from '../models/Meeting.js';
import { protect } from '../middleware/auth.js';
import mockStore from '../config/mockStore.js';
import { hasMeetCredentials, createGoogleMeet, deleteGoogleMeet } from '../utils/googleMeet.js';

const router = express.Router();

// Resolve the join URL + conferenceId for a NEW meeting.
// Hybrid: if a Google service account is configured, provision a REAL Google
// Meet link via the Calendar API; otherwise fall back to a manually entered
// https://meet.google.com/xxx link.
async function resolveMeetingLink({ title, startTime, durationMinutes, joinUrl }) {
  if (hasMeetCredentials()) {
    const created = await createGoogleMeet({ title, startTime, durationMinutes });
    return {
      joinUrl: created.joinUrl,
      conferenceId: created.conferenceId || ''
    };
  }
  return {
    joinUrl: joinUrl || '',
    conferenceId: ''
  };
}

// @desc    Create a meeting (any authenticated role)
// @route   POST /api/meetings
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, description, startTime, durationMinutes, targetAudience, classFilter, joinUrl, status } = req.body;

  if (!title || !startTime) {
    return res.status(400).json({ success: false, message: 'Title and start time are required.' });
  }

  try {
    let link;
    try {
      link = await resolveMeetingLink({ title, startTime, durationMinutes, joinUrl });
    } catch (meetError) {
      console.warn('Google Meet creation unavailable, using manual URL.', meetError.message);
      link = { joinUrl: joinUrl || '', conferenceId: '' };
    }

    if (!link.joinUrl) {
      return res.status(400).json({
        success: false,
        message: 'A Google Meet link is required. Either configure a Google service account or paste a manual meet link.'
      });
    }

    const payload = {
      title,
      description: description || '',
      startTime,
      durationMinutes: Number(durationMinutes) || 60,
      hostId: req.user._id,
      hostName: req.user.name || '',
      hostRole: req.user.role,
      joinUrl: link.joinUrl,
      conferenceId: link.conferenceId,
      targetAudience: targetAudience || 'all',
      classFilter: classFilter || '',
      status: status || 'scheduled'
    };

    if (mockStore.isMock) {
      const meeting = await mockStore.create('meetings', payload);
      return res.status(201).json({ success: true, data: meeting, message: 'Meeting scheduled successfully!' });
    }

    const meeting = await Meeting.create(payload);
    res.status(201).json({ success: true, data: meeting, message: 'Meeting scheduled successfully!' });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get meetings visible to the current user
// @route   GET /api/meetings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const role = req.user.role;

    if (mockStore.isMock) {
      let list = await mockStore.find('meetings');
      list = filterForRole(list, role, req.user._id);
      list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      return res.json({ success: true, count: list.length, data: list });
    }

    let query = {};
    if (role === 'admin') {
      query = {};
    } else if (role === 'teacher') {
      query = { $or: [{ hostId: req.user._id }, { targetAudience: { $in: ['all', 'teachers'] } }] };
    } else {
      query = { $or: [{ hostId: req.user._id }, { targetAudience: { $in: ['all', 'parents'] } }] };
    }

    const list = await Meeting.find(query).sort({ startTime: 1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// In-memory visibility filter mirroring the Mongoose $or queries above.
function filterForRole(list, role, userId) {
  if (role === 'admin') return list;
  return list.filter((m) => {
    if (String(m.hostId) === String(userId)) return true;
    if (role === 'teacher') return ['all', 'teachers'].includes(m.targetAudience);
    return ['all', 'parents'].includes(m.targetAudience);
  });
}

// @desc    Get a single meeting
// @route   GET /api/meetings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    if (mockStore.isMock) {
      const meeting = await mockStore.findById('meetings', req.params.id);
      if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
      return res.json({ success: true, data: meeting });
    }
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a meeting (host or admin only)
// @route   PUT /api/meetings/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, description, startTime, durationMinutes, targetAudience, classFilter, joinUrl, status } = req.body;

  try {
    const isMock = mockStore.isMock;
    let meeting;
    if (isMock) {
      meeting = await mockStore.findById('meetings', req.params.id);
    } else {
      meeting = await Meeting.findById(req.params.id);
    }

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const isOwner = String(meeting.hostId) === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this meeting.' });
    }

    const updates = {
      title: title ?? meeting.title,
      description: description ?? meeting.description,
      startTime: startTime ?? meeting.startTime,
      durationMinutes: durationMinutes ? Number(durationMinutes) : meeting.durationMinutes,
      targetAudience: targetAudience ?? meeting.targetAudience,
      classFilter: classFilter ?? meeting.classFilter,
      joinUrl: joinUrl || meeting.joinUrl,
      status: status ?? meeting.status
    };

    if (isMock) {
      Object.assign(meeting, updates);
      return res.json({ success: true, data: meeting, message: 'Meeting updated successfully!' });
    }

    Object.assign(meeting, updates);
    await meeting.save();
    res.json({ success: true, data: meeting, message: 'Meeting updated successfully!' });
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a meeting (host or admin only)
// @route   DELETE /api/meetings/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const isMock = mockStore.isMock;
    let meeting;
    if (isMock) {
      meeting = await mockStore.findById('meetings', req.params.id);
    } else {
      meeting = await Meeting.findById(req.params.id);
    }

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const isOwner = String(meeting.hostId) === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this meeting.' });
    }

    // Best-effort: cancel the backing Google Calendar event (if auto-provisioned).
    if (meeting.conferenceId) {
      await deleteGoogleMeet(meeting.conferenceId);
    }

    if (isMock) {
      await mockStore.findByIdAndDelete('meetings', req.params.id);
    } else {
      await Meeting.findByIdAndDelete(req.params.id);
    }

    res.json({ success: true, message: 'Meeting deleted successfully!' });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
