import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./store/slices/authSlice";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import DailyTracker from "./pages/DailyTracker";
import JournalPage from "./pages/JournalPage";
import InsightsPage from "./pages/InsightsPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  // Global auth listener - runs once when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get user role from localStorage or default to 'student'
        const savedRole = localStorage.getItem(`userRole_${user.uid}`) || 'student';
        const savedName = localStorage.getItem(`userName_${user.uid}`) || '';
        
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          role: savedRole,
          name: savedName,
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
      
      {/* Protected Student Routes */}
      <Route path="/student" element={<ProtectedRoute role="student" />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="tracker" element={<DailyTracker />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      
      {/* Protected Mentor Routes */}
      <Route path="/mentor" element={<ProtectedRoute role="mentor" />}>
        <Route path="dashboard" element={<MentorDashboard />} />
        <Route path="students" element={<MentorDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
