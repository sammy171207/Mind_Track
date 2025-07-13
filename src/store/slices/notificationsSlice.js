import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { db } from '../../firebase/config';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';


// Async thunks
export const checkStreak = createAsyncThunk(
  'notifications/checkStreak',
  async ({ userId, entries }, { rejectWithValue }) => {
    try {
      const streak = calculateStreak(entries);
      
      // Save streak to database
      const docRef = doc(db, 'streaks', userId);
      await setDoc(docRef, {
        userId,
        currentStreak: streak.current,
        longestStreak: streak.longest,
        lastUpdated: new Date().toISOString(),
      });
      
      return streak;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('read', '==', false),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      return notifications;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async ({ notificationId }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await setDoc(docRef, { read: true }, { merge: true });
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to calculate streak
const calculateStreak = (entries) => {
  if (!entries || entries.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Sort entries by date (newest first)
  const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if today's entry exists
  const todayEntry = sortedEntries.find(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  if (todayEntry) {
    currentStreak = 1;
    tempStreak = 1;
  }
  
  // Calculate consecutive days
  for (let i = 0; i < sortedEntries.length - 1; i++) {
    const currentDate = new Date(sortedEntries[i].date);
    const nextDate = new Date(sortedEntries[i + 1].date);
    
    const diffTime = currentDate.getTime() - nextDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
      if (i === 0 && todayEntry) {
        currentStreak = tempStreak;
      }
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      tempStreak = 1;
    }
  }
  
  // Update longest streak if current streak is longer
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }
  
  return { current: currentStreak, longest: longestStreak };
};

// Helper function to generate motivational messages
const generateMotivationalMessage = (streak) => {
  const messages = [
    "Great start! Every journey begins with a single step.",
    "You're building a great habit! Keep it up!",
    "Amazing consistency! You're on fire! 🔥",
    "Incredible dedication! You're unstoppable!",
    "You're creating positive change in your life!",
    "Your future self will thank you for this consistency!",
    "You're developing the habits of successful people!",
    "Keep going! You're stronger than you think!",
    "Every day you track is a day you're growing!",
    "You're building resilience and discipline!",
  ];
  
  if (streak === 1) {
    return messages[0];
  } else if (streak <= 3) {
    return messages[1];
  } else if (streak <= 7) {
    return messages[2];
  } else if (streak <= 14) {
    return messages[3];
  } else if (streak <= 30) {
    return messages[4];
  } else {
    return messages[5];
  }
};

const initialState = {
  notifications: [],
  currentStreak: 0,
  longestStreak: 0,
  loading: false,
  error: null,
  lastChecked: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkStreak.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkStreak.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStreak = action.payload.current;
        state.longestStreak = action.payload.longest;
        state.lastChecked = new Date().toISOString();
        
        // Add motivational notification for new streaks
        if (action.payload.current > 0) {
          const message = generateMotivationalMessage(action.payload.current);
          state.notifications.unshift({
            id: Date.now().toString(),
            type: 'streak',
            message,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      })
      .addCase(checkStreak.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload);
        if (index !== -1) {
          state.notifications[index].read = true;
        }
      });
  },
});

export const { addNotification, clearNotifications, clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer; 