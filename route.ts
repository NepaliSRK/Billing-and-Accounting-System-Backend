import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();
const router = Router();

router.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await prisma.product.findMany({});
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: {
          id,
        },
      });
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await prisma.product.create({
        data: req.body,
      });

      res.status(200).json({
        status: "success",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const delproduct = await prisma.product.delete({
        where: {
          id,
        },
      });
      res.json(delproduct);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await prisma.product.update({
        where: {
          id,
        },
        data: req.body,
      });
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

//For Category
router.get(
  "/category",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await prisma.category.findMany({});
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/category/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await prisma.category.findUnique({
        where: {
          id,
        },
      });
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/category",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await prisma.category.create({
        data: req.body,
      });

      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/category/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const delcategory = await prisma.category.delete({
        where: {
          id,
        },
      });
      res.json(delcategory);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/category",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await prisma.category.update({
        where: {
          id,
        },
        data: req.body,
      });
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
