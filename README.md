# MindTrack - Student Mental Wellness & Study Habit Journal

A comprehensive platform for students to track their daily study habits, reflect on mental wellness, and receive personalized insights and mentor guidance.

## 🚀 Features

### For Students
- **Daily Study & Wellness Tracker**: Log study hours, break time, sleep, stress levels, and focus
- **Markdown Journal**: Write reflections with full markdown support
- **AI-Powered Insights**: Receive personalized recommendations after 7 days of tracking
- **Streak Tracking**: Build consistency with motivational streak tracking
- **Progress Analytics**: View trends and patterns in your study habits
- **Data Export**: Download your data as JSON for personal records

### For Academic Mentors
- **Student Dashboard**: View anonymized student entries (when shared)
- **Comment System**: Provide supportive feedback on student reflections
- **Focus Area Suggestions**: Recommend specific wellness improvements
- **Student Analytics**: Track student engagement and progress

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **UI Components**: Heroicons, Custom Components
- **Markdown**: React Markdown with GFM support
- **Date Handling**: Day.js
- **PDF Generation**: jsPDF, html2canvas (for future export features)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindtracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase config and update `src/firebase/config.js`:

   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with navigation
│   └── ProtectedRoute.jsx # Authentication wrapper
├── pages/              # Page components
│   ├── LoginPage.jsx   # Authentication pages
│   ├── RegisterPage.jsx
│   ├── StudentDashboard.jsx # Student main dashboard
│   ├── DailyTracker.jsx     # Daily habit tracking
│   ├── JournalPage.jsx      # Markdown journal
│   ├── InsightsPage.jsx     # AI insights and analytics
│   ├── ProfilePage.jsx      # User profile and settings
│   └── MentorDashboard.jsx  # Mentor interface
├── store/              # Redux store and slices
│   ├── store.js        # Store configuration
│   └── slices/         # Redux slices
│       ├── authSlice.js      # Authentication state
│       ├── trackerSlice.js   # Daily tracking data
│       ├── journalSlice.js   # Journal entries
│       ├── insightsSlice.js  # AI insights
│       └── notificationsSlice.js # Streaks and notifications
├── firebase/           # Firebase configuration
│   └── config.js       # Firebase setup
└── main.jsx           # App entry point
```

## 🔐 Authentication & Roles

The platform supports two user roles:

### Student
- Track daily study habits and wellness metrics
- Write journal entries with markdown support
- Receive AI-generated insights
- Share entries with mentors (optional)
- View progress analytics and streaks

### Academic Mentor
- View shared student journal entries
- Provide comments and feedback
- Access student analytics
- Suggest focus areas for improvement

## 📊 Data Tracking

Students can track the following metrics daily:

- **Study Hours**: Time spent studying (0-24 hours)
- **Break Time**: Total break time in minutes
- **Sleep**: Hours of sleep the previous night
- **Stress Level**: Self-rated stress (1-5 scale)
- **Focus Level**: Self-rated focus (1-5 scale)
- **Reflection**: Free-form markdown journal entry

## 🤖 AI Insights

After 7 days of consistent tracking, the system generates personalized insights:

- **Pattern Recognition**: Identifies correlations between habits
- **Positive Reinforcement**: Celebrates good practices
- **Actionable Suggestions**: Provides specific improvement recommendations
- **Trend Analysis**: Shows progress over time

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode Ready**: Built with Tailwind CSS for easy theming
- **Accessibility**: Semantic HTML and keyboard navigation
- **Real-time Updates**: Instant feedback and auto-save
- **Beautiful Animations**: Smooth transitions and loading states

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Firebase Security Rules
Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /dailyEntries/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /journalEntries/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow read: if request.auth != null && resource.data.isPublic == true;
    }
    
    match /insights/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React and Firebase
- UI components inspired by modern design systems
- Icons from Heroicons
- Markdown support via React Markdown

## 📞 Support

For support, email support@mindtrack.com or create an issue in the repository.

---

**MindTrack** - Empowering students to build better study habits and mental wellness through mindful tracking and reflection.
