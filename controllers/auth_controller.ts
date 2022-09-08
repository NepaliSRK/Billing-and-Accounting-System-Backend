import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const client = new PrismaClient();

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await client.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return next(Error("Wrong credentials"));
    }

    let token = jwt.sign(user, process.env.SECRET_KEY as string);

    res.cookie("access_token", { token }, { httpOnly: true });
    console.log(token);
    return res.status(200).json({ message: "Cookie Set" });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    const user = await client.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    const error = new Error("Something went wrong.");
    return next(error);
  }
};
