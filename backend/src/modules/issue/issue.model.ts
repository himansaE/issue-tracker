import mongoose, { Document, Schema } from "mongoose";
import { IssueStatus, IssuePriority, IssueSeverity } from "./issue.enums";
import { Counter } from "./counter.model";

export interface IIssue extends Document {
  shortId: string;
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
    shortId: {
      type: String,
      unique: true,
      sparse: true,
    },
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
  },
);

issueSchema.index({ shortId: 1 });
issueSchema.index({ status: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ author: 1 });

issueSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "issueId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    if (counter) {
      this.shortId = `IS-${counter.seq.toString().padStart(4, "0")}`;
    }
  }
});

export const Issue = mongoose.model<IIssue>("Issue", issueSchema);
