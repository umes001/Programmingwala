import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm">
        {description}
      </p>

      {/* Decorative Element */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;