import axios from 'axios';
import { settings } from 'app.core.config';

const api = axios.create({ baseURL: settings.API_BASE_URL });

export const getApplications = async (filters: object): Promise<Application[]> => {
  const params = new URLSearchParams(filters as Record<string, string>);
  const response = await api.get('/applications', { params });
  return response.data;
};

export const getApplicationById = async (id: string): Promise<Application> => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const updateApplication = async (id: string, applicationData: object): Promise<Application> => {
  const response = await api.put(`/applications/${id}`, applicationData);
  return response.data;
};

export const getDocuments = async (applicationId: string): Promise<Document[]> => {
  const response = await api.get(`/applications/${applicationId}/documents`);
  return response.data;
};

// HUMAN ASSISTANCE NEEDED
// This function has a lower confidence level and may need additional error handling or file type validation
export const uploadDocument = async (applicationId: string, file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/applications/${applicationId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getWebhooks = async (): Promise<Webhook[]> => {
  const response = await api.get('/webhooks');
  return response.data;
};

export const registerWebhook = async (webhookData: object): Promise<Webhook> => {
  const response = await api.post('/webhooks', webhookData);
  return response.data;
};