import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const getCategoryColor = (categoryId) => {
    const colors = {
      'all': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      'early-learning': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
      'kindergarten': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'preschool': 'bg-green-100 text-green-800 hover:bg-green-200',
      'development': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'parenting': 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    };
    return colors[categoryId] || colors.all;
  };

  const getActiveCategoryColor = (categoryId) => {
    const colors = {
      'all': 'bg-gray-800 text-white',
      'early-learning': 'bg-pink-600 text-white',
      'kindergarten': 'bg-blue-600 text-white',
      'preschool': 'bg-green-600 text-white',
      'development': 'bg-purple-600 text-white',
      'parenting': 'bg-orange-600 text-white'
    };
    return colors[categoryId] || colors.all;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = selectedCategory === category.id;
        const baseColor = getCategoryColor(category.id);
        const activeColor = getActiveCategoryColor(category.id);

        return (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isActive ? activeColor : baseColor
            } ${isActive ? 'shadow-md' : 'shadow-sm'}`}
          >
            {category.name}
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;