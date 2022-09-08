import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controllers/product_controller";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.get("/:id", getProductById);
productRouter.post("/", createProduct);
productRouter.patch("/", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
