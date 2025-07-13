import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import trackerReducer from './slices/trackerSlice';
import journalReducer from './slices/journalSlice';
import insightsReducer from './slices/insightsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tracker: trackerReducer,
    journal: journalReducer,
    insights: insightsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store; 