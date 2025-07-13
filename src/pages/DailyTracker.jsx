import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateTodayEntry, 
  saveDailyEntry, 
  fetchDailyEntry 
} from '../store/slices/trackerSlice';
import { 
  ClockIcon, 
  EyeIcon, 
  HeartIcon, 
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

const DailyTracker = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { todayEntry, loading, lastSaved } = useSelector(state => state.tracker);
  
  const [today] = useState(dayjs().format('YYYY-MM-DD'));
  const [isDirty, setIsDirty] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchDailyEntry({ userId: user.uid, date: today }));
    }
  }, [dispatch, user?.uid, today]);

  useEffect(() => {
    if (lastSaved) {
      setShowSuccess(true);
      setIsDirty(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [lastSaved]);

  const handleInputChange = (field, value) => {
    dispatch(updateTodayEntry({ [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (user?.uid) {
      await dispatch(saveDailyEntry({
        userId: user.uid,
        date: today,
        entry: todayEntry
      }));
    }
  };

  const getStressColor = (level) => {
    if (level <= 2) return 'text-green-600';
    if (level <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFocusColor = (level) => {
    if (level >= 4) return 'text-green-600';
    if (level >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const metrics = [
    {
      name: 'Study Hours',
      field: 'studyHours',
      icon: ClockIcon,
      type: 'number',
      min: 0,
      max: 24,
      step: 0.5,
      placeholder: '0',
      description: 'How many hours did you study today?',
      color: 'text-blue-600'
    },
    {
      name: 'Break Time (minutes)',
      field: 'breakTime',
      icon: ClockIcon,
      type: 'number',
      min: 0,
      max: 480,
      step: 5,
      placeholder: '0',
      description: 'Total break time in minutes',
      color: 'text-green-600'
    },
    {
      name: 'Sleep Hours',
      field: 'sleep',
      icon: EyeIcon,
      type: 'number',
      min: 0,
      max: 24,
      step: 0.5,
      placeholder: '0',
      description: 'How many hours did you sleep last night?',
      color: 'text-purple-600'
    },
    {
      name: 'Stress Level',
      field: 'stressLevel',
      icon: HeartIcon,
      type: 'range',
      min: 1,
      max: 5,
      description: 'Rate your stress level (1 = Very Low, 5 = Very High)',
      color: 'text-red-600'
    },
    {
      name: 'Focus Level',
      field: 'focus',
      icon: AcademicCapIcon,
      type: 'range',
      min: 1,
      max: 5,
      description: 'Rate your focus level (1 = Poor, 5 = Excellent)',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Tracker</h1>
            <p className="text-gray-600 mt-1">
              Track your study habits and wellness for {dayjs(today).format('MMMM D, YYYY')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {showSuccess && (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-full">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Saved successfully!</span>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={loading || !isDirty}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CheckCircleIcon className="h-5 w-5" />
              )}
              <span>{loading ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric) => (
          <div key={metric.field} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
              <h3 className="text-lg font-medium text-gray-900">{metric.name}</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{metric.description}</p>
            
            {metric.type === 'range' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Low</span>
                  <span className={`text-lg font-semibold ${metric.field === 'stressLevel' ? getStressColor(todayEntry[metric.field]) : getFocusColor(todayEntry[metric.field])}`}>
                    {todayEntry[metric.field] || 3}
                  </span>
                  <span className="text-sm text-gray-500">High</span>
                </div>
                <input
                  type="range"
                  min={metric.min}
                  max={metric.max}
                  value={todayEntry[metric.field] || 3}
                  onChange={(e) => handleInputChange(metric.field, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  {Array.from({ length: metric.max }, (_, i) => (
                    <span key={i + 1}>{i + 1}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type={metric.type}
                  min={metric.min}
                  max={metric.max}
                  step={metric.step}
                  value={todayEntry[metric.field] || ''}
                  onChange={(e) => handleInputChange(metric.field, parseFloat(e.target.value) || 0)}
                  placeholder={metric.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {metric.field === 'studyHours' && (
                  <span className="absolute right-3 top-2 text-gray-500">hours</span>
                )}
                {metric.field === 'breakTime' && (
                  <span className="absolute right-3 top-2 text-gray-500">min</span>
                )}
                {metric.field === 'sleep' && (
                  <span className="absolute right-3 top-2 text-gray-500">hours</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reflection Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">Daily Reflection</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Take a moment to reflect on your day. What went well? What could you improve? 
          This helps build self-awareness and track your progress over time.
        </p>
        
        <textarea
          value={todayEntry.reflection || ''}
          onChange={(e) => handleInputChange('reflection', e.target.value)}
          placeholder="Write your thoughts about today's study session and overall wellness..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
        
        <div className="mt-2 text-sm text-gray-500">
          {todayEntry.reflection?.length || 0} characters
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 text-indigo-600 mr-2" />
          Daily Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Aim for 7-9 hours of sleep for optimal cognitive function</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Take regular breaks (5-10 minutes every hour) to maintain focus</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Practice stress management techniques like deep breathing</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Consistency is key - even 30 minutes of focused study daily helps</p>
          </div>
        </div>
      </div>

      {/* Auto-save indicator */}
      {isDirty && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium">Unsaved changes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTracker; 