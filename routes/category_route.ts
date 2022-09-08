import { Router } from "express";
import {
  deleteCategory,
  getAllCategory,
  createCategory,
  updateCategory,
} from "../controllers/category_controller";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.post("/", createCategory);
categoryRouter.patch("/", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
