import { Request, Response } from "express";
import { Issue } from "./issue.model";
import { createIssueSchema, updateIssueSchema } from "./issue.schema";
import { IssueStatus } from "./issue.enums";
import mongoose from "mongoose";

// GET /api/issues
export const getIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority } = req.query;
    const searchStr = typeof req.query.search === 'string' ? req.query.search : undefined;
    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (searchStr) {
      const escaped = searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [{ title: regex }, { shortId: regex }];
    }

    const issues = await Issue.find(filter)
      .populate("author", "name email avatarUrl")
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/issues/:id
export const getIssueById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid issue ID format" });
      return;
    }

    const issue = await Issue.findById(req.params.id).populate(
      "author",
      "name email avatarUrl",
    );

    if (!issue) {
      res.status(404).json({ success: false, message: "Issue not found" });
      return;
    }

    res.status(200).json({ success: true, data: issue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/issues
export const createIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = createIssueSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ success: false, errors: parsed.error.flatten().fieldErrors });
      return;
    }

    let issue = await Issue.create({
      ...parsed.data,
      author: req.user!.id,
    });
    
    issue = await issue.populate("author", "name email avatarUrl");

    res.status(201).json({ success: true, data: issue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/issues/:id
export const updateIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid issue ID format" });
      return;
    }

    const parsed = updateIssueSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ success: false, errors: parsed.error.flatten().fieldErrors });
      return;
    }

    let issue = await Issue.findById(req.params.id);
    if (!issue) {
      res.status(404).json({ success: false, message: "Issue not found" });
      return;
    }

    if (issue.author.toString() !== req.user!.id) {
      res.status(403).json({
        success: false,
        message: "Forbidden – You can only edit your own issues",
      });
      return;
    }

    issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: parsed.data },
      { new: true, runValidators: true },
    ).populate("author", "name email avatarUrl");

    res.status(200).json({ success: true, data: issue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/issues/:id
export const deleteIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid issue ID format" });
      return;
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      res.status(404).json({ success: false, message: "Issue not found" });
      return;
    }

    if (issue.author.toString() !== req.user!.id) {
      res.status(403).json({
        success: false,
        message: "Forbidden – You can only delete your own issues",
      });
      return;
    }

    await issue.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/issues/reorder
export const reorderIssues = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { items } = req.body as {
      items: Array<{ id: string; status: IssueStatus; order: number }>;
    };

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: "items array is required" });
      return;
    }

    const bulkOps = items.map(({ id, status, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { status, order } },
      },
    }));

    await Issue.bulkWrite(bulkOps);

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
