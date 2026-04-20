import api from './index';
import type { AuthResponse, RegisterInput, LoginInput } from '../../types/auth';

export const registerUser = (payload: RegisterInput) =>
  api.post<AuthResponse>('/api/auth/register', payload).then((r) => r.data);

export const loginUser = (payload: LoginInput) =>
  api.post<AuthResponse>('/api/auth/login', payload).then((r) => r.data);

export const getMe = () =>
  api.get<{ success: boolean; data: AuthResponse['data']['user'] }>('/api/auth/me').then((r) => r.data);
