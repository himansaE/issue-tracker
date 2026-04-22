import { Router } from "express";
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  reorderIssues,
} from "./issue.controller";
import { protect } from "../../middleware/auth.middleware";

const router: Router = Router();

router.use(protect);

router.route("/").get(getIssues).post(createIssue);

// Must be before /:id to avoid route conflict
router.route("/reorder").put(reorderIssues);

router.route("/:id").get(getIssueById).put(updateIssue).delete(deleteIssue);

export default router;
