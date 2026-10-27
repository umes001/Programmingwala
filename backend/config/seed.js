import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Parent from '../models/Parent.js';
import Teacher from '../models/Teacher.js';
import Admission from '../models/Admission.js';
import Announcement from '../models/Announcement.js';
import Gallery from '../models/Gallery.js';
import Event from '../models/Event.js';
import Fee from '../models/Fee.js';
import Message from '../models/Message.js';
import Query from '../models/Query.js';
import Receipt from '../models/Receipt.js';
import mockStore from './mockStore.js';

export const seedDatabase = async () => {
  if (mockStore.isMock) {
    console.log('Database running in Mock mode. Seeding bypassed (using in-memory store).');
    return;
  }

  try {
    // Check if users already exist
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already populated. Skipping database seeding.');
      return;
    }

    console.log('Database is empty. Seeding initial kindergarten demo data into MongoDB Atlas...');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'School Administrator',
      email: 'admin@pranidha.edu',
      password: 'admin123',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });

    const parentUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'parent@pranidha.edu',
      password: 'parent123',
      role: 'parent',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    });

    const teacherUser = await User.create({
      name: 'Miss Emily Stone',
      email: 'teacher@pranidha.edu',
      password: 'teacher123',
      role: 'teacher',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    });

    const studentUser = await User.create({
      name: 'Demo Student',
      email: 'student@pranidha.edu',
      password: 'student123',
      role: 'user',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    });

    // 2. Create Teacher Profile
    const teacher = await Teacher.create({
      userId: teacherUser._id,
      name: teacherUser.name,
      email: teacherUser.email,
      phone: '+1 (555) 014-9988',
      specialization: 'Early Childhood Education',
      qualifications: 'M.Ed. in Child Development',
      classesAssigned: ['Preschool', 'Nursery', 'Junior KG']
    });

    // 3. Create Parent Profile
    const parent = await Parent.create({
      userId: parentUser._id,
      name: parentUser.name,
      email: parentUser.email,
      phone: '+1 (555) 019-2834',
      address: '742 Evergreen Terrace, Springfield',
      occupation: 'Pediatrician',
      children: []
    });

    // 4. Create Students
    const student1 = await Student.create({
      name: 'Tommy Jenkins',
      studentId: 'STD-2026-0001',
      dateOfBirth: new Date('2022-04-12'),
      gender: 'Male',
      class: 'Preschool',
      parentId: parent._id,
      teacherId: teacher._id,
      attendance: [
        { date: new Date('2026-06-08'), status: 'present' },
        { date: new Date('2026-06-09'), status: 'present' },
        { date: new Date('2026-06-10'), status: 'absent' },
        { date: new Date('2026-06-11'), status: 'present' }
      ],
      progressReports: [
        {
          term: 'Term 1',
          cognitive: 85,
          social: 90,
          creative: 78,
          motorSkills: 88,
          notes: 'Tommy is highly curious and loves building blocks.'
        }
      ],
      activities: [
        { date: new Date(), time: '10:30 AM', title: 'Art & Craft', description: 'Painted a beautiful flower layout.', category: 'art' },
        { date: new Date(), time: '12:00 PM', title: 'Healthy Lunch', description: 'Finished all vegetables and fruit.', category: 'food' },
        { date: new Date(), time: '01:30 PM', title: 'Nap Time', description: 'Slept peacefully for 1 hour.', category: 'nap' }
      ]
    });

    const student2 = await Student.create({
      name: 'Lily Watson',
      studentId: 'STD-2026-0002',
      dateOfBirth: new Date('2021-08-22'),
      gender: 'Female',
      class: 'Nursery',
      parentId: parent._id, // link to same parent for simplicity
      teacherId: teacher._id,
      attendance: [
        { date: new Date('2026-06-08'), status: 'present' },
        { date: new Date('2026-06-09'), status: 'present' },
        { date: new Date('2026-06-10'), status: 'present' },
        { date: new Date('2026-06-11'), status: 'present' }
      ],
      progressReports: [
        {
          term: 'Term 1',
          cognitive: 95,
          social: 88,
          creative: 92,
          motorSkills: 85,
          notes: 'Lily is excellent at drawing and helps other children.'
        }
      ],
      activities: [
        { date: new Date(), time: '10:00 AM', title: 'Playground Games', description: 'Played tag and slides with peers.', category: 'play' }
      ]
    });

    // Link children to Parent profile
    parent.children = [student1._id, student2._id];
    await parent.save();

    // 5. Create Fees (12 monthly invoices: first paid, rest pending)
    for (let i = 1; i <= 12; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + (i - 1));
      const fee = await Fee.create({
        studentId: student1._id,
        amount: 12500,
        term: `Month ${i} Tuition Fee`,
        dueDate: dueDate,
        status: i === 1 ? 'paid' : 'pending',
        paymentDate: i === 1 ? new Date() : null,
        transactionId: i === 1 ? 'TXN-987216439' : '',
        paymentMethod: i === 1 ? 'Credit Card' : ''
      });

      if (i === 1) {
        await Receipt.create({
          feeId: fee._id,
          studentId: student1._id,
          receiptNumber: `REC-1718102400000`,
          amountPaid: 12500,
          paymentMethod: 'Credit Card',
          paymentDate: new Date(),
          transactionId: 'TXN-987216439'
        });
      }
    }

    // 6. Create Admissions
    await Admission.create([
      {
        applicationNumber: 'PRN-2026-1001',
        studentDetails: { name: 'Aiden Smith', dateOfBirth: new Date('2022-09-15'), gender: 'Male', class: 'Pre-Nursery' },
        parentDetails: { fatherName: 'John Smith', motherName: 'Jane Smith', email: 'smith@example.com', phone: '+1 (555) 012-3456', address: '123 Main St, Springfield' },
        documents: { birthCertificate: 'mock_birth_cert.pdf', photo: 'mock_photo.jpg' },
        status: 'pending',
        remarks: 'Awaiting birth certificate verification.'
      },
      {
        applicationNumber: 'PRN-2026-1002',
        studentDetails: { name: 'Sophia Grace', dateOfBirth: new Date('2021-11-05'), gender: 'Female', class: 'Junior KG' },
        parentDetails: { fatherName: 'Robert Grace', motherName: 'Emma Grace', email: 'grace@example.com', phone: '+1 (555) 098-7654', address: '456 Elm St, Springfield' },
        documents: { birthCertificate: 'mock_birth_cert2.pdf', photo: 'mock_photo2.jpg' },
        status: 'approved',
        remarks: 'All documents verified. Admission offered.'
      }
    ]);

    // 7. Create Announcements
    await Announcement.create([
      {
        title: 'Summer Vacation Circular 2026',
        content: 'The school will remain closed for summer break starting from June 15th to July 20th. Classes will resume on July 21st with normal timings. Have a safe and happy summer!',
        category: 'circular',
        targetAudience: 'all',
        date: new Date('2026-06-10T10:00:00Z'),
        attachmentUrl: '/assets/documents/summer_vacation_circular.pdf'
      },
      {
        title: 'Parent Teacher Meeting (PTM)',
        content: 'Our monthly Parent Teacher Meeting is scheduled for Saturday, June 13th, from 9:00 AM to 12:30 PM. Please follow the slot timings sent by your respective class teachers.',
        category: 'event',
        targetAudience: 'parents',
        date: new Date('2026-06-11T08:30:00Z')
      },
      {
        title: 'Heavy Rain Warning - School Delayed',
        content: 'Due to warnings of heavy rain and waterlogging tomorrow, school start time is delayed by 2 hours. School buses will pick up children 2 hours later than standard timings.',
        category: 'emergency',
        targetAudience: 'all',
        date: new Date()
      }
    ]);

    // 8. Create Events
    await Event.create([
      {
        title: 'PTM Meet',
        description: 'Discuss Term 1 children progress and development milestones.',
        startDate: new Date('2026-06-13T09:00:00Z'),
        endDate: new Date('2026-06-13T13:00:00Z'),
        type: 'ptm'
      },
      {
        title: 'Summer Camp Kickoff',
        description: 'Interactive sports, painting, and music camp for nursery & KG children.',
        startDate: new Date('2026-06-20T08:00:00Z'),
        endDate: new Date('2026-06-25T14:00:00Z'),
        type: 'celebration'
      },
      {
        title: 'Independence Day Holiday',
        description: 'National holiday celebration and school closed.',
        startDate: new Date('2026-07-04T00:00:00Z'),
        endDate: new Date('2026-07-04T23:59:59Z'),
        type: 'holiday'
      }
    ]);

    // 9. Create Gallery Items
    await Gallery.create([
      {
        title: 'Annual Day Celebrations',
        description: 'Kids wearing adorable costumes for the theatrical play.',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800',
        category: 'events',
        date: new Date('2026-04-10')
      },
      {
        title: 'Outdoor Fun in the Sandbox',
        description: 'Building sandcastles and learning cooperation.',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800',
        category: 'sports',
        date: new Date('2026-05-18')
      },
      {
        title: 'Little Painters at Work',
        description: 'Expressing creativity in our modern activity rooms.',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800',
        category: 'classroom',
        date: new Date('2026-06-02')
      }
    ]);

    // 10. Create Messages
    await Message.create([
      {
        senderId: parentUser._id,
        receiverId: teacherUser._id,
        content: 'Hello Miss Emily, I noticed Tommy had a bit of sniffles today. Please keep an eye on him during outdoor play.',
        timestamp: new Date(Date.now() - 3600000 * 3),
        isRead: true
      },
      {
        senderId: teacherUser._id,
        receiverId: parentUser._id,
        content: 'Sure Sarah, thank you for letting me know. I will make sure he stays inside the heated play area and stays hydrated.',
        timestamp: new Date(Date.now() - 3600000 * 2),
        isRead: true
      }
    ]);

    // 11. Create Query
    await Query.create({
      name: 'Michael Davis',
      email: 'michael@example.com',
      phone: '+1 (555) 018-4933',
      subject: 'Admission Inquiry for KG-1',
      message: 'Hello, I want to know about the admission dates and the bus transport availability for the Springfield area. Thanks!',
      status: 'unread'
    });

    console.log('Database successfully seeded with demo assets!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
