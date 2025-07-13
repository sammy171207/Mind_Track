import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase/config';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// Async thunks
export const generateInsights = createAsyncThunk(
  'insights/generateInsights',
  async ({ userId, entries }, { rejectWithValue }) => {
    try {
      // Analyze patterns from entries
      const insights = analyzePatterns(entries);
      
      // Save insights to database
      const docRef = doc(db, 'insights', userId);
      await setDoc(docRef, {
        userId,
        insights,
        lastGenerated: new Date().toISOString(),
      });
      
      return insights;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInsights = createAsyncThunk(
  'insights/fetchInsights',
  async (userId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'insights', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().insights;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to analyze patterns
const analyzePatterns = (entries) => {
  if (!entries || entries.length < 7) {
    return [];
  }

  const insights = [];
  
  // Calculate averages
  const avgStudyHours = entries.reduce((sum, entry) => sum + (entry.studyHours || 0), 0) / entries.length;
  const avgSleep = entries.reduce((sum, entry) => sum + (entry.sleep || 0), 0) / entries.length;
  const avgStress = entries.reduce((sum, entry) => sum + (entry.stressLevel || 3), 0) / entries.length;
  const avgFocus = entries.reduce((sum, entry) => sum + (entry.focus || 3), 0) / entries.length;
  
  // Study hours insights
  if (avgStudyHours > 6) {
    insights.push({
      type: 'study_hours',
      message: `You're averaging ${avgStudyHours.toFixed(1)} hours of study per day. That's excellent dedication!`,
      category: 'positive',
      priority: 'high'
    });
  } else if (avgStudyHours < 2) {
    insights.push({
      type: 'study_hours',
      message: `You're averaging ${avgStudyHours.toFixed(1)} hours of study per day. Consider gradually increasing your study time.`,
      category: 'suggestion',
      priority: 'medium'
    });
  }
  
  // Sleep insights
  if (avgSleep >= 8) {
    insights.push({
      type: 'sleep',
      message: `Great job maintaining ${avgSleep.toFixed(1)} hours of sleep on average! Good sleep supports better focus and learning.`,
      category: 'positive',
      priority: 'high'
    });
  } else if (avgSleep < 6) {
    insights.push({
      type: 'sleep',
      message: `You're averaging ${avgSleep.toFixed(1)} hours of sleep. Consider aiming for 7-9 hours for optimal cognitive function.`,
      category: 'suggestion',
      priority: 'high'
    });
  }
  
  // Stress level insights
  if (avgStress <= 2) {
    insights.push({
      type: 'stress',
      message: `Your stress levels are well-managed (average: ${avgStress.toFixed(1)}/5). Keep up the great work!`,
      category: 'positive',
      priority: 'medium'
    });
  } else if (avgStress >= 4) {
    insights.push({
      type: 'stress',
      message: `Your stress levels are elevated (average: ${avgStress.toFixed(1)}/5). Consider incorporating more breaks and relaxation techniques.`,
      category: 'suggestion',
      priority: 'high'
    });
  }
  
  // Focus insights
  if (avgFocus >= 4) {
    insights.push({
      type: 'focus',
      message: `Your focus levels are strong (average: ${avgFocus.toFixed(1)}/5). You're in a great learning zone!`,
      category: 'positive',
      priority: 'medium'
    });
  } else if (avgFocus <= 2) {
    insights.push({
      type: 'focus',
      message: `Your focus levels could improve (average: ${avgFocus.toFixed(1)}/5). Try studying in shorter, more focused sessions.`,
      category: 'suggestion',
      priority: 'medium'
    });
  }
  
  // Pattern analysis
  const highFocusEntries = entries.filter(entry => entry.focus >= 4);
  const highFocusWithGoodSleep = highFocusEntries.filter(entry => entry.sleep >= 7);
  
  if (highFocusWithGoodSleep.length > highFocusEntries.length * 0.7) {
    insights.push({
      type: 'pattern',
      message: "You focus better when you get 7+ hours of sleep. This is a great pattern to maintain!",
      category: 'insight',
      priority: 'high'
    });
  }
  
  const lowStressEntries = entries.filter(entry => entry.stressLevel <= 2);
  const lowStressWithBreaks = lowStressEntries.filter(entry => entry.breakTime >= 30);
  
  if (lowStressWithBreaks.length > lowStressEntries.length * 0.6) {
    insights.push({
      type: 'pattern',
      message: "Taking longer breaks seems to help reduce your stress levels. Consider incorporating more break time.",
      category: 'insight',
      priority: 'medium'
    });
  }
  
  return insights;
};

const initialState = {
  insights: [],
  loading: false,
  error: null,
  lastGenerated: null,
};

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    clearInsights: (state) => {
      state.insights = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload;
        state.lastGenerated = new Date().toISOString();
      })
      .addCase(generateInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInsights, clearError } = insightsSlice.actions;
export default insightsSlice.reducer; 