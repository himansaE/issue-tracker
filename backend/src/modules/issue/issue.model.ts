import mongoose, { Document, Schema } from "mongoose";
import { IssueStatus, IssuePriority, IssueSeverity } from "./issue.enums";

export interface IIssue extends Document {
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(IssueStatus),
      default: IssueStatus.OPEN,
    },
    priority: {
      type: String,
      enum: Object.values(IssuePriority),
      default: IssuePriority.MEDIUM,
    },
    severity: {
      type: String,
      enum: Object.values(IssueSeverity),
      default: IssueSeverity.MEDIUM,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster querying, especially when filtering by status on the Kanban board
issueSchema.index({ status: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ author: 1 });

export const Issue = mongoose.model<IIssue>("Issue", issueSchema);
