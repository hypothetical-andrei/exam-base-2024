import genericError from "./generic-error-middleware.mjs";
import auth from "./auth-middleware.mjs";
import getPermMiddleware from "./perm-middleware.mjs";
import assignedTaskMiddleware from "./assigned-task-middleware.mjs";
import getUserTypeMiddleware from "./user-type-middleware.mjs";
import commentTaskMiddleware from "./comment-task-middleware.mjs";

export default {
  auth,
  genericError,
  getPermMiddleware,
  assignedTaskMiddleware,
  getUserTypeMiddleware,
  commentTaskMiddleware,
};
