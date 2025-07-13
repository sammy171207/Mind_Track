import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase/config';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// Async thunks
export const saveDailyEntry = createAsyncThunk(
  'tracker/saveDailyEntry',
  async ({ userId, date, entry }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'dailyEntries', `${userId}_${date}`);
      await setDoc(docRef, {
        userId,
        date,
        ...entry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { date, entry };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDailyEntry = createAsyncThunk(
  'tracker/fetchDailyEntry',
  async ({ userId, date }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'dailyEntries', `${userId}_${date}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { date, entry: docSnap.data() };
      }
      return { date, entry: null };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeeklyEntries = createAsyncThunk(
  'tracker/fetchWeeklyEntries',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const entriesRef = collection(db, 'dailyEntries');
      const q = query(
        entriesRef,
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push(doc.data());
      });
      return entries;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  todayEntry: {
    studyHours: 0,
    breakTime: 0,
    sleep: 0,
    stressLevel: 3,
    focus: 3,
    reflection: '',
  },
  weeklyEntries: [],
  currentStreak: 0,
  longestStreak: 0,
  loading: false,
  error: null,
  lastSaved: null,
};

const trackerSlice = createSlice({
  name: 'tracker',
  initialState,
  reducers: {
    updateTodayEntry: (state, action) => {
      state.todayEntry = { ...state.todayEntry, ...action.payload };
    },
    resetTodayEntry: (state) => {
      state.todayEntry = initialState.todayEntry;
    },
    setCurrentStreak: (state, action) => {
      state.currentStreak = action.payload;
    },
    setLongestStreak: (state, action) => {
      state.longestStreak = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveDailyEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDailyEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSaved = new Date().toISOString();
        // Update weekly entries if the saved entry is within the current week
        const existingIndex = state.weeklyEntries.findIndex(
          entry => entry.date === action.payload.date
        );
        if (existingIndex >= 0) {
          state.weeklyEntries[existingIndex] = action.payload.entry;
        } else {
          state.weeklyEntries.push(action.payload.entry);
        }
      })
      .addCase(saveDailyEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDailyEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyEntry.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.entry) {
          state.todayEntry = action.payload.entry;
        }
      })
      .addCase(fetchDailyEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWeeklyEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyEntries = action.payload;
      })
      .addCase(fetchWeeklyEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  updateTodayEntry, 
  resetTodayEntry, 
  setCurrentStreak, 
  setLongestStreak, 
  clearError 
} = trackerSlice.actions;

export default trackerSlice.reducer; 