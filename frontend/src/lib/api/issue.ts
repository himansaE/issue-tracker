import api from "./index";
import type {
  CreateIssueInput,
  UpdateIssueInput,
  IssuesResponse,
  SingleIssueResponse,
} from "../../types/issue";

export const issueApi = {
  // Get all issues with optional filters
  getIssues: async (params?: { status?: string; priority?: string; search?: string }) => {
    const response = await api.get<IssuesResponse>("/api/issues", { params });
    return response.data;
  },

  // Get single issue
  getIssueById: async (id: string) => {
    const response = await api.get<SingleIssueResponse>(`/api/issues/${id}`);
    return response.data;
  },

  // Create issue
  createIssue: async (data: CreateIssueInput) => {
    const response = await api.post<SingleIssueResponse>("/api/issues", data);
    return response.data;
  },

  // Update issue
  updateIssue: async (id: string, data: UpdateIssueInput) => {
    const response = await api.put<SingleIssueResponse>(
      `/api/issues/${id}`,
      data,
    );
    return response.data;
  },

  // Reorder issues (bulk update status + order)
  reorderIssues: async (items: Array<{ id: string; status: string; order: number }>) => {
    const response = await api.put<{ success: boolean }>('/api/issues/reorder', { items });
    return response.data;
  },

  // Delete issue
  deleteIssue: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: {} }>(
      `/api/issues/${id}`,
    );
    return response.data;
  },
};
