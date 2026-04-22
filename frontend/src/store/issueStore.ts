import { create } from "zustand";
import type { Issue, CreateIssueInput, UpdateIssueInput } from "../types/issue";
import { issueApi } from "../lib/api/issue";

interface IssueState {
  issues: Issue[];
  isLoading: boolean;
  error: string | null;

  // actions
  fetchIssues: (filters?: {
    status?: string;
    priority?: string;
  }) => Promise<void>;
  createIssue: (data: CreateIssueInput) => Promise<Issue>;
  updateIssue: (id: string, data: UpdateIssueInput) => Promise<Issue>;
  deleteIssue: (id: string) => Promise<void>;
}

export const useIssueStore = create<IssueState>((set) => ({
  issues: [],
  isLoading: false,
  error: null,

  fetchIssues: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await issueApi.getIssues(filters);
      set({ issues: response.data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to fetch issues",
      });
    }
  },

  createIssue: async (data: CreateIssueInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await issueApi.createIssue(data);
      const newIssue = response.data;
      set((state) => ({
        issues: [newIssue, ...state.issues], // Add new to top
        isLoading: false,
      }));
      return newIssue;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to create issue",
      });
      throw err;
    }
  },

  updateIssue: async (id: string, data: UpdateIssueInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await issueApi.updateIssue(id, data);
      const updatedIssue = response.data;

      set((state) => ({
        issues: state.issues.map((i) => (i.id === id ? updatedIssue : i)),
        isLoading: false,
      }));
      return updatedIssue;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to update issue",
      });
      throw err;
    }
  },

  deleteIssue: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await issueApi.deleteIssue(id);
      set((state) => ({
        issues: state.issues.filter((i) => i.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to delete issue",
      });
      throw err;
    }
  },
}));
