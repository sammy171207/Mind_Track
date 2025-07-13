import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchInsights, 
  generateInsights 
} from '../store/slices/insightsSlice';
import { 
  fetchWeeklyEntries 
} from '../store/slices/trackerSlice';
import { 
  LightBulbIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChartBarIcon,
  CalendarIcon,
  FireIcon, 
  ClockIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

const InsightsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { insights, loading } = useSelector(state => state.insights);
  const { weeklyEntries } = useSelector(state => state.tracker);
  
  const [weekStart] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [weekEnd] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchInsights(user.uid));
      dispatch(fetchWeeklyEntries({ 
        userId: user.uid, 
        startDate: weekStart, 
        endDate: weekEnd 
      }));
    }
  }, [dispatch, user?.uid, weekStart, weekEnd]);

  useEffect(() => {
    if (weeklyEntries.length >= 7) {
      dispatch(generateInsights({ userId: user?.uid, entries: weeklyEntries }));
    }
  }, [dispatch, weeklyEntries, user?.uid]);

  const getInsightIcon = (category) => {
    switch (category) {
      case 'positive':
        return <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />;
      case 'suggestion':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case 'insight':
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <LightBulbIcon className="h-6 w-6 text-indigo-500" />;
    }
  };

  const getInsightColor = (category) => {
    switch (category) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'suggestion':
        return 'bg-yellow-50 border-yellow-200';
      case 'insight':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-indigo-50 border-indigo-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateTrends = () => {
    if (weeklyEntries.length < 2) return null;

    const recentEntries = weeklyEntries.slice(0, 7);
    const olderEntries = weeklyEntries.slice(7, 14);

    if (olderEntries.length === 0) return null;

    const recentAvg = {
      studyHours: recentEntries.reduce((sum, e) => sum + (e.studyHours || 0), 0) / recentEntries.length,
      sleep: recentEntries.reduce((sum, e) => sum + (e.sleep || 0), 0) / recentEntries.length,
      stressLevel: recentEntries.reduce((sum, e) => sum + (e.stressLevel || 3), 0) / recentEntries.length,
      focus: recentEntries.reduce((sum, e) => sum + (e.focus || 3), 0) / recentEntries.length,
    };

    const olderAvg = {
      studyHours: olderEntries.reduce((sum, e) => sum + (e.studyHours || 0), 0) / olderEntries.length,
      sleep: olderEntries.reduce((sum, e) => sum + (e.sleep || 0), 0) / olderEntries.length,
      stressLevel: olderEntries.reduce((sum, e) => sum + (e.stressLevel || 3), 0) / olderEntries.length,
      focus: olderEntries.reduce((sum, e) => sum + (e.focus || 3), 0) / olderEntries.length,
    };

    return {
      studyHours: recentAvg.studyHours - olderAvg.studyHours,
      sleep: recentAvg.sleep - olderAvg.sleep,
      stressLevel: recentAvg.stressLevel - olderAvg.stressLevel,
      focus: recentAvg.focus - olderAvg.focus,
    };
  };

  const trends = calculateTrends();

  const actionItems = [
    {
      title: "Improve Sleep Schedule",
      description: "Aim for 7-9 hours of consistent sleep",
      icon: EyeIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Take Regular Breaks",
      description: "5-10 minute breaks every hour",
      icon: ClockIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Practice Stress Management",
      description: "Deep breathing, meditation, or exercise",
      icon: HeartIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Optimize Study Environment",
      description: "Minimize distractions, good lighting",
      icon: ChartBarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Insights & Analytics</h1>
            <p className="text-gray-600 mt-1">
              Personalized insights based on your study and wellness patterns
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full">
            <LightBulbIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              {insights.length} insights available
            </span>
          </div>
        </div>
      </div>

      {/* Data Requirements Notice */}
      {weeklyEntries.length < 7 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">
                More Data Needed
              </h3>
              <p className="text-yellow-700 mt-1">
                Complete {7 - weeklyEntries.length} more days of tracking to receive personalized insights. 
                We need at least 7 days of data to analyze your patterns effectively.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trends Overview */}
      {trends && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Trends (Last 7 Days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <ClockIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Study Hours</p>
                <p className={`text-lg font-semibold ${trends.studyHours > 0 ? 'text-green-600' : trends.studyHours < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {trends.studyHours > 0 ? '+' : ''}{trends.studyHours.toFixed(1)}h
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <EyeIcon className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Sleep</p>
                <p className={`text-lg font-semibold ${trends.sleep > 0 ? 'text-green-600' : trends.sleep < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {trends.sleep > 0 ? '+' : ''}{trends.sleep.toFixed(1)}h
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <HeartIcon className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Stress</p>
                <p className={`text-lg font-semibold ${trends.stressLevel < 0 ? 'text-green-600' : trends.stressLevel > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {trends.stressLevel > 0 ? '+' : ''}{trends.stressLevel.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <ChartBarIcon className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-600">Focus</p>
                <p className={`text-lg font-semibold ${trends.focus > 0 ? 'text-green-600' : trends.focus < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {trends.focus > 0 ? '+' : ''}{trends.focus.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Insights */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Insights</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.category)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.category)}
                      <div className="flex-1">
                        <p className="text-gray-900">{insight.message}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                            {insight.priority} priority
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {insight.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No insights yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Complete more tracking days to receive personalized insights.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recommended Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {actionItems.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg ${item.bgColor}`}>
                  <div className="flex items-start space-x-3">
                    <item.icon className={`h-6 w-6 ${item.color} mt-1`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Weekly Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Days Tracked</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyEntries.length}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClockIcon className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Avg Study Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {weeklyEntries.length > 0 
                  ? (weeklyEntries.reduce((sum, e) => sum + (e.studyHours || 0), 0) / weeklyEntries.length).toFixed(1)
                  : '0'
                }h
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <EyeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Avg Sleep</p>
              <p className="text-2xl font-bold text-gray-900">
                {weeklyEntries.length > 0 
                  ? (weeklyEntries.reduce((sum, e) => sum + (e.sleep || 0), 0) / weeklyEntries.length).toFixed(1)
                  : '0'
                }h
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FireIcon className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">Best Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...weeklyEntries.map((_, i) => {
                  let streak = 0;
                  for (let j = i; j < weeklyEntries.length; j++) {
                    if (weeklyEntries[j]) streak++;
                    else break;
                  }
                  return streak;
                }), 0)} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips for Better Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tips for Better Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Track consistently for at least 7 days to get meaningful patterns</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Be honest with your stress and focus ratings for accurate insights</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Include detailed reflections to help identify patterns</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Review insights regularly and adjust your habits accordingly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage; 