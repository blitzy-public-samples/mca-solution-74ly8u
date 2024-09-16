import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, getCurrentUser } from '../services/auth';

interface User {
  // Define user properties here
}

interface UserState {
  currentUser: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk<string, { username: string; password: string }>(
  'user/loginUser',
  async (credentials) => {
    const token = await login(credentials);
    return token;
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  'user/logoutUser',
  async () => {
    await logout();
  }
);

export const fetchCurrentUser = createAsyncThunk<User, void>(
  'user/fetchCurrentUser',
  async () => {
    const user = await getCurrentUser();
    return user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        // HUMAN ASSISTANCE NEEDED
        // TODO: Handle storing the JWT token securely (e.g., in localStorage)
        // and update the currentUser state if needed
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user data';
      });
  },
});

export default userSlice.reducer;