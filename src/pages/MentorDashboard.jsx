import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchPublicEntries,
  addMentorComment 
} from '../store/slices/journalSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  UserGroupIcon, 
  EyeIcon, 
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  HeartIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

const MentorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { publicEntries, mentorComments } = useSelector(state => state.journal);
  
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchPublicEntries());
    }
  }, [dispatch, user?.uid]);

  const handleAddComment = async (entryId) => {
    if (comment.trim() && user?.uid) {
      await dispatch(addMentorComment({
        journalEntryId: entryId,
        mentorId: user.uid,
        comment: comment.trim()
      }));
      setComment('');
    }
  };

  const filteredEntries = publicEntries.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'recent') {
      return dayjs(entry.date).isAfter(dayjs().subtract(7, 'day'));
    }
    if (filter === 'stress') {
      // This would need to be connected to tracker data
      return true;
    }
    return true;
  });

  const getWellnessIndicator = (entry) => {
    // This would be connected to actual tracker data
    const indicators = [];
    if (entry.content?.toLowerCase().includes('stress')) {
      indicators.push({ type: 'stress', color: 'text-red-600', icon: HeartIcon });
    }
    if (entry.content?.toLowerCase().includes('focus')) {
      indicators.push({ type: 'focus', color: 'text-blue-600', icon: AcademicCapIcon });
    }
    if (entry.content?.toLowerCase().includes('sleep')) {
      indicators.push({ type: 'sleep', color: 'text-purple-600', icon: ClockIcon });
    }
    return indicators;
  };

  const mentorSuggestions = [
    {
      title: "Maintain Sleep Cycle",
      description: "Encourage consistent 7-9 hours of sleep",
      icon: ClockIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Reduce Screen Time",
      description: "Suggest breaks from digital devices",
      icon: EyeIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Practice Mindfulness",
      description: "Recommend meditation or breathing exercises",
      icon: HeartIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Study Environment",
      description: "Help optimize their study space",
      icon: AcademicCapIcon,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Support your students' wellness and study journey
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full">
            <UserGroupIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              {publicEntries.length} shared entries
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Student Entries</h2>
              <div className="flex space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Entries</option>
                  <option value="recent">Recent (7 days)</option>
                  <option value="stress">Stress-related</option>
                </select>
              </div>
            </div>
          </div>

          {/* Entries List */}
          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, index) => (
                <div key={index} className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Student Entry - {dayjs(entry.date).format('MMMM D, YYYY')}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Shared {dayjs(entry.createdAt).fromNow()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getWellnessIndicator(entry).map((indicator, idx) => (
                          <div key={idx} className={`flex items-center space-x-1 ${indicator.color}`}>
                            <indicator.icon className="h-4 w-4" />
                            <span className="text-xs font-medium">{indicator.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="prose max-w-none mb-4">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {entry.content}
                      </ReactMarkdown>
                    </div>

                    {/* Comment Section */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a supportive comment or suggestion..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                          />
                        </div>
                        <button
                          onClick={() => handleAddComment(entry.id || index)}
                          disabled={!comment.trim()}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No entries yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Students will appear here when they share their journal entries.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center space-x-2">
                  <EyeIcon className="h-4 w-4" />
                  <span>View All Students</span>
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2">
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  <span>Send Group Message</span>
                </button>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mentor Suggestions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Suggested Focus Areas</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mentorSuggestions.map((suggestion, index) => (
                  <div key={index} className={`p-3 rounded-lg ${suggestion.bgColor}`}>
                    <div className="flex items-start space-x-3">
                      <suggestion.icon className={`h-5 w-5 ${suggestion.color} mt-1`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Overview</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Students</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {new Set(publicEntries.map(e => e.userId)).size}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Comments</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {mentorComments.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {publicEntries.filter(e => dayjs(e.date).isAfter(dayjs().subtract(7, 'day'))).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips for Mentors */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mentoring Tips</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Provide specific, actionable feedback</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Focus on patterns rather than individual days</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Encourage self-reflection and growth</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Celebrate progress and small wins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard; 