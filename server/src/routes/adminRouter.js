import express from "express";
import { VerifyJwt } from "../middlewares/Auth.middlewares.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { createUser } from "../controllers/adminController/createUser.controller.js";
import { getCompanyUsers } from "../controllers/adminController/getAllUsers.controllers.js";
import { adminSubmit } from "../controllers/adminController/adminSubmit.controller.js";
import { approverAction } from "../controllers/adminController/approverAction.controller.js";
import { getCompanyManagers } from "../controllers/adminController/getAllManagers.js";
import { updateUserManager } from "../controllers/adminController/updateManager.controller.js";


const adminRouter = express.Router();

adminRouter.use(VerifyJwt);
adminRouter.use(isAdmin);

adminRouter.post("/create-user", createUser);
adminRouter.get("/company-users", getCompanyUsers);
adminRouter.post("/approval-submit/:id", adminSubmit);
adminRouter.post("/approver-action/:id", approverAction);
adminRouter.get("/manager", getCompanyManagers);
adminRouter.patch("/update-manager", updateUserManager);

export default adminRouter;
