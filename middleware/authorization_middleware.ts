import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token || req.headers["access_token"];
    if (!token) {
      return res.status(401).send("Login to access data");
    }
    const verify = jwt.verify(token, process.env.SECRET_KEY as string);
    req.body.user = verify;
    next();
  } catch {
    return res.sendStatus(403);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await auth(req, res, next);
  try {
    if (req.body.role != "Admin") return res.status(401).send("Access Denied");
    next();
  } catch {
    return res.sendStatus(403);
  }
};
