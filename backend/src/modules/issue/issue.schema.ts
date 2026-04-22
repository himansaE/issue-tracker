import { z } from "zod";
import { IssueStatus, IssuePriority, IssueSeverity } from "./issue.enums";

export const issueStatusEnum = z.nativeEnum(IssueStatus);
export const issuePriorityEnum = z.nativeEnum(IssuePriority);
export const issueSeverityEnum = z.nativeEnum(IssueSeverity);

export const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  status: issueStatusEnum.default(IssueStatus.OPEN),
  priority: issuePriorityEnum.default(IssuePriority.MEDIUM),
  severity: issueSeverityEnum.default(IssueSeverity.MEDIUM),
});

export const updateIssueSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long").optional(),
  description: z.string().min(1, "Description is required").optional(),
  status: issueStatusEnum.optional(),
  priority: issuePriorityEnum.optional(),
  severity: issueSeverityEnum.optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
