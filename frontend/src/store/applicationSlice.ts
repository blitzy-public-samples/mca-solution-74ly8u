import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getApplications, getApplicationById, updateApplication } from '../services/api';
import { ApplicationSchema } from '../schema/applicationSchema';

export const fetchApplications = createAsyncThunk(
  'application/fetchApplications',
  async (filters: object) => {
    const applications = await getApplications(filters);
    return applications;
  }
);

export const fetchApplicationById = createAsyncThunk(
  'application/fetchApplicationById',
  async (id: string) => {
    const application = await getApplicationById(id);
    return application;
  }
);

// HUMAN ASSISTANCE NEEDED
// The confidence level for this function is below 0.8. Please review and adjust as necessary.
export const updateApplicationStatus = createAsyncThunk(
  'application/updateApplicationStatus',
  async (updateData: object) => {
    const updatedApplication = await updateApplication(updateData);
    return updatedApplication;
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applications: [] as ApplicationSchema[],
    selectedApplication: null as ApplicationSchema | null,
    status: 'idle',
    error: null as string | null,
  },
  reducers: {
    setSelectedApplication: (state, action: PayloadAction<string>) => {
      state.selectedApplication = state.applications.find(app => app.id === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchApplicationById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updateApplicationStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        if (state.selectedApplication && state.selectedApplication.id === action.payload.id) {
          state.selectedApplication = action.payload;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { setSelectedApplication } = applicationSlice.actions;

export default applicationSlice.reducer;