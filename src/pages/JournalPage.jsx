import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateCurrentEntry, 
  saveJournalEntry, 
  fetchJournalEntry,
  fetchJournalHistory 
} from '../store/slices/journalSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BookOpenIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

const JournalPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { currentEntry, journalHistory, loading, lastSaved } = useSelector(state => state.journal);
  
  const [today] = useState(dayjs().format('YYYY-MM-DD'));
  const [isDirty, setIsDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchJournalEntry({ userId: user.uid, date: selectedDate }));
      dispatch(fetchJournalHistory({ userId: user.uid, limit: 30 }));
    }
  }, [dispatch, user?.uid, selectedDate]);

  useEffect(() => {
    if (lastSaved) {
      setShowSuccess(true);
      setIsDirty(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [lastSaved]);

  const handleContentChange = (content) => {
    dispatch(updateCurrentEntry({ content }));
    setIsDirty(true);
  };

  const handlePublicToggle = () => {
    dispatch(updateCurrentEntry({ isPublic: !currentEntry.isPublic }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (user?.uid) {
      await dispatch(saveJournalEntry({
        userId: user.uid,
        date: selectedDate,
        content: currentEntry.content,
        isPublic: currentEntry.isPublic
      }));
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDirty(false);
  };

  const markdownGuide = [
    { syntax: '**bold**', description: 'Bold text' },
    { syntax: '*italic*', description: 'Italic text' },
    { syntax: '# Heading', description: 'Large heading' },
    { syntax: '## Subheading', description: 'Medium heading' },
    { syntax: '- List item', description: 'Bullet list' },
    { syntax: '1. Numbered item', description: 'Numbered list' },
    { syntax: '[Link](url)', description: 'Hyperlink' },
    { syntax: '![Alt text](image-url)', description: 'Image' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journal</h1>
            <p className="text-gray-600 mt-1">
              Reflect on your day and track your thoughts
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Journal Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date Selector */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="text-gray-600">
                {dayjs(selectedDate).format('MMMM D, YYYY')}
              </span>
            </div>
          </div>

          {/* Journal Editor */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Today's Reflection</h2>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={currentEntry.isPublic || false}
                      onChange={handlePublicToggle}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Share with mentor</span>
                  </label>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {showPreview ? (
                      <>
                        <EyeSlashIcon className="h-4 w-4" />
                        <span>Hide Preview</span>
                      </>
                    ) : (
                      <>
                        <EyeIcon className="h-4 w-4" />
                        <span>Show Preview</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {showPreview ? (
                <div className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentEntry.content || '*Start writing your reflection...*'}
                  </ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={currentEntry.content || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write your thoughts, feelings, and reflections for today. You can use markdown formatting to organize your thoughts better..."
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              )}
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>{currentEntry.content?.length || 0} characters</span>
                {currentEntry.isPublic && (
                  <span className="flex items-center space-x-1 text-blue-600">
                    <EyeIcon className="h-4 w-4" />
                    <span>Visible to mentor</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Markdown Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
              Markdown Formatting Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {markdownGuide.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <code className="bg-white px-2 py-1 rounded text-blue-600 font-mono">
                    {item.syntax}
                  </code>
                  <span className="text-gray-600">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Journal History */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Entries</h3>
            </div>
            <div className="p-6">
              {journalHistory.length > 0 ? (
                <div className="space-y-4">
                  {journalHistory.slice(0, 10).map((entry, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateChange(entry.date)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedDate === entry.date
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {dayjs(entry.date).format('MMM D, YYYY')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {entry.content?.substring(0, 80) || 'No content'}...
                      </p>
                      {entry.isPublic && (
                        <span className="inline-flex items-center mt-2 text-xs text-blue-600">
                          <EyeIcon className="h-3 w-3 mr-1" />
                          Shared
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No journal entries yet. Start writing to build your reflection habit!
                </p>
              )}
            </div>
          </div>

          {/* Writing Prompts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Writing Prompts</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800 mb-2">What went well today?</p>
                  <p className="text-green-700">Reflect on your achievements and positive moments.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800 mb-2">What challenged you?</p>
                  <p className="text-blue-700">Think about obstacles and how you handled them.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-800 mb-2">What did you learn?</p>
                  <p className="text-purple-700">Consider new insights about yourself or your studies.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="font-medium text-orange-800 mb-2">Tomorrow's goals?</p>
                  <p className="text-orange-700">Plan what you want to accomplish or improve.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Journaling Tips</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Write regularly, even if just a few sentences</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Be honest with yourself - this is for your growth</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use markdown to organize your thoughts</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Share with your mentor for additional guidance</p>
              </div>
            </div>
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

export default JournalPage; 