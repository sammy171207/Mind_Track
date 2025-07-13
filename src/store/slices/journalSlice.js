import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase/config';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore';

// Async thunks
export const saveJournalEntry = createAsyncThunk(
  'journal/saveJournalEntry',
  async ({ userId, date, content, isPublic = false }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'journalEntries', `${userId}_${date}`);
      await setDoc(docRef, {
        userId,
        date,
        content,
        isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { date, content, isPublic };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchJournalEntry = createAsyncThunk(
  'journal/fetchJournalEntry',
  async ({ userId, date }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'journalEntries', `${userId}_${date}`);
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

export const fetchJournalHistory = createAsyncThunk(
  'journal/fetchJournalHistory',
  async ({ userId, limit = 30 }, { rejectWithValue }) => {
    try {
      const entriesRef = collection(db, 'journalEntries');
      const q = query(
        entriesRef,
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push(doc.data());
      });
      return entries.slice(0, limit);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMentorComment = createAsyncThunk(
  'journal/addMentorComment',
  async ({ journalEntryId, mentorId, comment }, { rejectWithValue }) => {
    try {
      const commentRef = await addDoc(collection(db, 'mentorComments'), {
        journalEntryId,
        mentorId,
        comment,
        createdAt: new Date().toISOString(),
      });
      return { id: commentRef.id, comment };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPublicEntries = createAsyncThunk(
  'journal/fetchPublicEntries',
  async (_, { rejectWithValue }) => {
    try {
      const entriesRef = collection(db, 'journalEntries');
      const q = query(
        entriesRef,
        where('isPublic', '==', true),
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
  currentEntry: {
    content: '',
    isPublic: false,
  },
  journalHistory: [],
  publicEntries: [],
  mentorComments: [],
  loading: false,
  error: null,
  lastSaved: null,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    updateCurrentEntry: (state, action) => {
      state.currentEntry = { ...state.currentEntry, ...action.payload };
    },
    resetCurrentEntry: (state) => {
      state.currentEntry = initialState.currentEntry;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSaved = new Date().toISOString();
        // Update journal history
        const existingIndex = state.journalHistory.findIndex(
          entry => entry.date === action.payload.date
        );
        if (existingIndex >= 0) {
          state.journalHistory[existingIndex] = action.payload;
        } else {
          state.journalHistory.unshift(action.payload);
        }
      })
      .addCase(saveJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.entry) {
          state.currentEntry = action.payload.entry;
        }
      })
      .addCase(fetchJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJournalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.journalHistory = action.payload;
      })
      .addCase(fetchJournalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPublicEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.publicEntries = action.payload;
      })
      .addCase(fetchPublicEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMentorComment.fulfilled, (state, action) => {
        state.mentorComments.push(action.payload);
      });
  },
});

export const { updateCurrentEntry, resetCurrentEntry, clearError } = journalSlice.actions;
export default journalSlice.reducer; 