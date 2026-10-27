import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  Award,
  Shield,
  Users,
  ChevronRight
} from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <Award className="w-4 h-4 mr-2" />
              Premium Learning Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Early Learning
              <span className="text-blue-600 block">Reimagined</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Discover our premium coaching LMS designed specifically for young learners.
              Interactive video lessons, secure streaming, and progress tracking for
              your child's educational journey.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">500+ Videos</div>
                  <div className="text-sm text-gray-500">Interactive Lessons</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Secure</div>
                  <div className="text-sm text-gray-500">Video Streaming</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-500">Happy Students</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Certified</div>
                  <div className="text-sm text-gray-500">Instructors</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/lms/courses"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
              >
                Start Learning Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/lms/demo"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Mockup Browser */}
              <div className="bg-gray-800 p-3 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-gray-300 text-sm">
                  learning.pranidha.com
                </div>
              </div>

              {/* Video Player Mockup */}
              <div className="bg-gray-900 aspect-video relative">
                {/* Video Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-white font-semibold">Interactive Lesson</div>
                    <div className="text-white/80 text-sm">Early Math Concepts</div>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="text-white hover:text-blue-300">
                        <PlayCircle className="w-6 h-6" />
                      </button>
                      <div className="text-white text-sm">12:45 / 25:30</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="text-white hover:text-blue-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16.33 4.1a1 1 0 00-1.66 1.13l1.484 2.173a4 4 0 010 4.194l-1.484 2.173a1 1 0 001.66 1.13l1.484-2.173a6 6 0 000-6.294L16.33 4.1z" />
                        </svg>
                      </button>
                      <button className="text-white hover:text-blue-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-4 -left-4 bg-white p-3 rounded-xl shadow-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">50+</div>
                  <div className="text-xs text-gray-500">Live Classes</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">98%</div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;