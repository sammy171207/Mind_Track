import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  fetchWeeklyEntries, 
  fetchDailyEntry 
} from '../store/slices/trackerSlice';
import { 
  fetchInsights, 
  generateInsights 
} from '../store/slices/insightsSlice';
import { 
  checkStreak, 
  fetchNotifications 
} from '../store/slices/notificationsSlice';
import { 
  fetchJournalHistory 
} from '../store/slices/journalSlice';
import { 
  ChartBarIcon, 
  BookOpenIcon, 
  LightBulbIcon, 
  FireIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { weeklyEntries, currentStreak, longestStreak } = useSelector(state => state.tracker);
  const { insights } = useSelector(state => state.insights);
  const { notifications } = useSelector(state => state.notifications);
  const { journalHistory } = useSelector(state => state.journal);
  
  const [today] = useState(dayjs().format('YYYY-MM-DD'));
  const [weekStart] = useState(dayjs().startOf('week').format('YYYY-MM-DD'));
  const [weekEnd] = useState(dayjs().endOf('week').format('YYYY-MM-DD'));

  useEffect(() => {
    if (user?.uid) {
      // Fetch today's entry
      dispatch(fetchDailyEntry({ userId: user.uid, date: today }));
      
      // Fetch weekly entries
      dispatch(fetchWeeklyEntries({ 
        userId: user.uid, 
        startDate: weekStart, 
        endDate: weekEnd 
      }));
      
      // Fetch insights
      dispatch(fetchInsights(user.uid));
      
      // Fetch notifications
      dispatch(fetchNotifications(user.uid));
      
      // Fetch journal history
      dispatch(fetchJournalHistory({ userId: user.uid, limit: 5 }));
    }
  }, [dispatch, user?.uid, today, weekStart, weekEnd]);

  useEffect(() => {
    if (weeklyEntries.length >= 7) {
      dispatch(generateInsights({ userId: user?.uid, entries: weeklyEntries }));
      dispatch(checkStreak({ userId: user?.uid, entries: weeklyEntries }));
    }
  }, [dispatch, weeklyEntries, user?.uid]);

  const calculateWeeklyStats = () => {
    if (weeklyEntries.length === 0) return { avgStudyHours: 0, avgSleep: 0, avgStress: 0 };
    
    const totalStudyHours = weeklyEntries.reduce((sum, entry) => sum + (entry.studyHours || 0), 0);
    const totalSleep = weeklyEntries.reduce((sum, entry) => sum + (entry.sleep || 0), 0);
    const totalStress = weeklyEntries.reduce((sum, entry) => sum + (entry.stressLevel || 3), 0);
    
    return {
      avgStudyHours: (totalStudyHours / weeklyEntries.length).toFixed(1),
      avgSleep: (totalSleep / weeklyEntries.length).toFixed(1),
      avgStress: (totalStress / weeklyEntries.length).toFixed(1),
    };
  };

  const stats = calculateWeeklyStats();
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const quickActions = [
    {
      name: 'Log Today\'s Entry',
      href: '/student/tracker',
      icon: ChartBarIcon,
      description: 'Track your study habits and wellness',
      color: 'bg-blue-500',
    },
    {
      name: 'Write Journal',
      href: '/student/journal',
      icon: BookOpenIcon,
      description: 'Reflect on your day',
      color: 'bg-green-500',
    },
    {
      name: 'View Insights',
      href: '/student/insights',
      icon: LightBulbIcon,
      description: 'See personalized recommendations',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Let's continue your wellness and study journey
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {unreadNotifications > 0 && (
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {unreadNotifications} new notifications
              </div>
            )}
            <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              <FireIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{currentStreak} day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Study Hours</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgStudyHours}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Sleep</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgSleep}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HeartIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Stress Level</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgStress}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FireIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium align-center text-gray-500">Longest Streak</p>
              <p className="text-2xl font-semibold text-gray-900">{longestStreak} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div>
                  <span className={`inline-flex p-3 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                    {action.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{action.description}</p>
                </div>
                <span className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Journal Entries */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Journal Entries</h2>
          </div>
          <div className="p-6">
            {journalHistory.length > 0 ? (
              <div className="space-y-4">
                {journalHistory.slice(0, 3).map((entry, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <p className="text-sm text-gray-500">
                      {dayjs(entry.date).format('MMM D, YYYY')}
                    </p>
                    <p className="text-gray-900 mt-1 line-clamp-2">
                      {entry.content.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No journal entries yet. Start writing to track your thoughts!
              </p>
            )}
            <div className="mt-4">
              <Link
                to="/student/journal"
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                View all entries →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Insights */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Insights</h2>
          </div>
          <div className="p-6">
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      insight.category === 'positive' ? 'bg-green-400' :
                      insight.category === 'suggestion' ? 'bg-yellow-400' :
                      'bg-blue-400'
                    }`} />
                    <p className="text-sm text-gray-700">{insight.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Complete 7 days of tracking to get personalized insights!
              </p>
            )}
            <div className="mt-4">
              <Link
                to="/student/insights"
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                View all insights →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">This Week's Progress</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const entry = weeklyEntries.find(e => 
                dayjs(e.date).day() === (index + 1) % 7
              );
              return (
                <div key={day} className="text-center">
                  <p className="text-xs text-gray-500 mb-2">{day}</p>
                  <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-medium ${
                    entry ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {entry ? '✓' : '-'}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            {weeklyEntries.length} of 7 days completed this week
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 