import express from "express";
import { VerifyJwt } from "../middlewares/Auth.middlewares.js";
import { createExpense } from "../controllers/expenseController/createExpense.controller.js";
import { getMyExpenses } from "../controllers/expenseController/getMyExpense.controller.js";
import { getAllExpenses } from "../controllers/expenseController/getAllExpenses.controller.js";
import { getPendingExpenses } from "../controllers/expenseController/getPendingExpensess.controller.js";
import { approveExpense } from "../controllers/expenseController/approveExpense.controller.js";
import { rejectExpense } from "../controllers/expenseController/rejectExpense.controller.js";
import { overrideExpense } from "../controllers/expenseController/overrideExpense.controller.js";
import { deleteExpense } from "../controllers/expenseController/deleteExpense.controller.js";


const expenseRouter = express.Router();

expenseRouter.use(VerifyJwt);

expenseRouter.post("/create", createExpense);
expenseRouter.get("/my-expenses", getMyExpenses);
expenseRouter.get("/company/:id", getAllExpenses);
expenseRouter.get("/pending", getPendingExpenses);
expenseRouter.post("/approve/:id", approveExpense);
expenseRouter.post("/reject/:id", rejectExpense);
expenseRouter.post("/override/:id", overrideExpense);
expenseRouter.delete("/delete/:id", deleteExpense);

export default expenseRouter;
