import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  BookOpenIcon,
  LightBulbIcon,
  UserGroupIcon,
  HeartIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const features = [
    {
      icon: ChartBarIcon,
      title: "Daily Tracking",
      description: "Track study hours, sleep, stress levels, and focus daily to build healthy habits."
    },
    {
      icon: BookOpenIcon,
      title: "Journal Entries",
      description: "Write markdown journal entries to reflect on your day and track your progress."
    },
    {
      icon: LightBulbIcon,
      title: "AI Insights",
      description: "Get personalized insights and recommendations based on your tracking data."
    },
    {
      icon: UserGroupIcon,
      title: "Mentor Support",
      description: "Academic mentors can view anonymized entries and provide guidance."
    },
    {
      icon: HeartIcon,
      title: "Wellness Focus",
      description: "Prioritize mental health alongside academic performance."
    },
    {
      icon: ClockIcon,
      title: "Streak Tracking",
      description: "Build momentum with streak tracking and progress visualization."
    }
  ];

  const studentSteps = [
    {
      step: 1,
      title: "Create Your Account",
      description: "Register as a student with your email and basic information.",
      details: "Choose 'Student' role during registration and provide your full name."
    },
    {
      step: 2,
      title: "Complete Daily Tracker",
      description: "Fill out your daily study and wellness metrics.",
      details: "Track study hours, break time, sleep, stress level (1-5), and focus level (1-5)."
    },
    {
      step: 3,
      title: "Write Journal Entries",
      description: "Reflect on your day using markdown formatting.",
      details: "Share your thoughts, challenges, and achievements. Choose to make entries public for mentor feedback."
    },
    {
      step: 4,
      title: "Review Insights",
      description: "Check AI-generated insights and patterns in your data.",
      details: "Get personalized recommendations for improving study habits and wellness."
    },
    {
      step: 5,
      title: "Monitor Progress",
      description: "View your streaks, trends, and overall progress over time.",
      details: "Use the dashboard to track your improvement and maintain motivation."
    }
  ];

  const mentorSteps = [
    {
      step: 1,
      title: "Register as Mentor",
      description: "Create an account with the 'Academic Mentor' role.",
      details: "Provide your credentials and experience in academic mentoring."
    },
    {
      step: 2,
      title: "Access Student Entries",
      description: "View anonymized student journal entries and tracking data.",
      details: "Students can choose to make their entries public for mentor review."
    },
    {
      step: 3,
      title: "Provide Feedback",
      description: "Add supportive comments and suggestions to student entries.",
      details: "Offer guidance on study habits, stress management, and wellness practices."
    },
    {
      step: 4,
      title: "Monitor Trends",
      description: "Identify patterns and trends across multiple students.",
      details: "Use insights to provide better guidance and support."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <AcademicCapIcon className="h-12 w-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900 ml-3">MindTrack</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive platform for student mental wellness and study habit tracking, 
            connecting students with academic mentors for personalized guidance.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="flex items-start">
            <InformationCircleIcon className="h-8 w-8 text-indigo-600 mt-1 mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                MindTrack empowers students to develop healthy study habits while prioritizing their mental wellness. 
                Through daily tracking, reflective journaling, and AI-powered insights, we help students build 
                sustainable academic routines. Our platform connects students with experienced academic mentors 
                who provide personalized guidance and support throughout their educational journey.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use - Students */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Use MindTrack - Students</h2>
          <div className="space-y-6">
            {studentSteps.map((step) => (
              <div key={step.step} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                    <strong>Details:</strong> {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use - Mentors */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Use MindTrack - Academic Mentors</h2>
          <div className="space-y-6">
            {mentorSteps.map((step) => (
              <div key={step.step} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                    <strong>Details:</strong> {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                For Students
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Track your data consistently every day
                </li>
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Be honest about your stress and focus levels
                </li>
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Write regular journal entries to reflect on your progress
                </li>
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Review insights weekly to identify patterns
                </li>
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Share entries with mentors when you need guidance
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                For Mentors
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Check for new entries regularly
                </li>
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Provide constructive and supportive feedback
                </li>
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Focus on both academic and wellness aspects
                </li>
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Encourage consistent tracking and reflection
                </li>
                <li className="flex items-start">
                  <ArrowRightIcon className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                  Share resources and strategies for improvement
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Join MindTrack today and take control of your academic journey while prioritizing your mental wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-semibold"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="bg-gray-100 text-gray-900 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors font-semibold"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 