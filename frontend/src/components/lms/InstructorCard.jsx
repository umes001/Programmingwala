import React from 'react';
import { Award, Star, Users, BookOpen, MessageSquare } from 'lucide-react';

const InstructorCard = ({ instructor }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start space-x-4">
        {/* Instructor Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={instructor.profileImage || '/api/placeholder/64/64'}
              alt={instructor.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Instructor Info */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-1">
            {instructor.name}
          </h3>
          
          <div className="text-sm text-gray-600 mb-3">
            {instructor.qualifications || 'Early Childhood Education Expert'}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                <Star className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">4.9</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-2">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">10K+</div>
                <div className="text-xs text-gray-500">Students</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">50+</div>
                <div className="text-xs text-gray-500">Courses</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-2">
                <Award className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">15</div>
                <div className="text-xs text-gray-500">Years Exp</div>
              </div>
            </div>
          </div>
          
          {/* Bio Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {instructor.bio || 'Experienced educator with over 10 years of teaching experience in early childhood education. Specialized in creating engaging and interactive learning experiences for young children.'}
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button className="flex-1 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Message
            </button>
            
            <button className="flex-1 py-2 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Expertise Tags */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Areas of Expertise</h4>
        <div className="flex flex-wrap gap-2">
          {['Early Learning', 'Cognitive Development', 'Social Skills', 'Creative Arts', 'Parenting Guidance'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;