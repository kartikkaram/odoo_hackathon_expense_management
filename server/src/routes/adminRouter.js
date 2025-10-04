import express from "express";
import { VerifyJwt } from "../middlewares/Auth.middlewares";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { createUser } from "../controllers/adminController/createUser.controller";
import { getCompanyUsers } from "../controllers/adminController/getAllUsers.controllers";
import { adminSubmit } from "../controllers/adminController/adminSubmit.controller";
import { approverAction } from "../controllers/adminController/approverAction.controller";
import { getCompanyManagers } from "../controllers/adminController/getAllManagers";
import { updateUserManager } from "../controllers/adminController/updateManager.controller";


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
