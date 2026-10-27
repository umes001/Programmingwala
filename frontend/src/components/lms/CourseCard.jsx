import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  Star,
  PlayCircle,
  BookOpen,
  Award
} from 'lucide-react';

const CourseCard = ({ course }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'early-learning': 'bg-pink-100 text-pink-800',
      'kindergarten': 'bg-blue-100 text-blue-800',
      'preschool': 'bg-green-100 text-green-800',
      'development': 'bg-purple-100 text-purple-800',
      'parenting': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  const getLevelBadge = (level) => {
    const levels = {
      'beginner': { text: 'Beginner', color: 'bg-green-100 text-green-800' },
      'intermediate': { text: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
      'advanced': { text: 'Advanced', color: 'bg-red-100 text-red-800' },
      'all-levels': { text: 'All Levels', color: 'bg-blue-100 text-blue-800' }
    };
    return levels[level] || levels['beginner'];
  };

  const levelBadge = getLevelBadge(course.level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.imageUrl || '/api/placeholder/400/240'}
          alt={course.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(course.category)}`}>
            {course.category.replace('-', ' ')}
          </span>
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelBadge.color}`}>
            {levelBadge.text}
          </span>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to={`/lms/courses/${course._id}`}
              className="inline-flex items-center justify-center w-full py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              View Course
            </Link>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Instructor */}
        {course.instructor && (
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
              <img
                src={course.instructor.profileImage || '/api/placeholder/32/32'}
                alt={course.instructor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-600">{course.instructor.name}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          <Link to={`/lms/courses/${course._id}`} className="hover:text-blue-600 transition-colors">
            {course.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{course.totalDuration || 0} min</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>{course.totalLessons || 0} lessons</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{course.totalEnrollments || 0}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(course.rating || 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {course.rating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              ({course.totalRatings || 0})
            </span>
          </div>
          
          {course.isFeatured && (
            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
              <Award className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* normalise price — could be string "0" from API */}
          {(() => {
            const price = Number(course.price) || 0;
            const discounted = Number(course.discountedPrice) || 0;
            const isPaid = price > 0;
            return (
              <>
                <div>
                  {isPaid ? (
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{discounted > 0 && discounted < price ? discounted : price}
                      </span>
                      {discounted > 0 && discounted < price && (
                        <span className="text-sm text-gray-500 line-through ml-2">₹{price}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-green-600">Free</span>
                  )}
                </div>

                <Link
                  to={isPaid ? `/lms/courses/${course._id}` : `/lms/learn/${course._id}`}
                  className={`px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors ${
                    isPaid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isPaid ? 'Buy Now' : 'Watch Free'}
                </Link>
              </>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;