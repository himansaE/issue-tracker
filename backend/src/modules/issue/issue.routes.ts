import { Router } from "express";
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} from "./issue.controller";
import { protect } from "../../middleware/auth.middleware";

const router: Router = Router();

router.use(protect);

router.route("/").get(getIssues).post(createIssue);

router.route("/:id").get(getIssueById).put(updateIssue).delete(deleteIssue);

export default router;
