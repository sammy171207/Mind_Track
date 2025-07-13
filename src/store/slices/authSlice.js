import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../../firebase/config';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get saved role from localStorage or default to 'student'
      const savedRole = localStorage.getItem(`userRole_${userCredential.user.uid}`) || 'student';
      const savedName = localStorage.getItem(`userName_${userCredential.user.uid}`) || '';
      
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: savedRole,
        name: savedName,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, role = 'student', name }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user role and name to localStorage for persistence
      localStorage.setItem(`userRole_${userCredential.user.uid}`, role);
      localStorage.setItem(`userName_${userCredential.user.uid}`, name);
      
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role,
        name,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      // Clear localStorage on logout
      localStorage.clear();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start with loading true to check auth state
  error: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.role = action.payload?.role || null;
      state.loading = false; // Set loading to false when user state is set
    },
    clearError: (state) => {
      state.error = null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
      if (state.user) {
        state.user.role = action.payload;
        // Save to localStorage
        localStorage.setItem(`userRole_${state.user.uid}`, action.payload);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
        state.loading = false;
      });
  },
});

export const { setUser, clearError, setRole, setLoading } = authSlice.actions;
export default authSlice.reducer; 