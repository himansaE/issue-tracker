export const IssueStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const IssuePriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type IssuePriority = (typeof IssuePriority)[keyof typeof IssuePriority];

export const IssueSeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export type IssueSeverity = (typeof IssueSeverity)[keyof typeof IssueSeverity];

export interface Issue {
  id: string;
  shortId?: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  order: number;
  author: {
    _id?: string;
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  severity?: IssueSeverity;
}

export interface UpdateIssueInput extends Partial<CreateIssueInput> {}

export interface IssuesResponse {
  success: boolean;
  count: number;
  data: Issue[];
}

export interface SingleIssueResponse {
  success: boolean;
  data: Issue;
}
