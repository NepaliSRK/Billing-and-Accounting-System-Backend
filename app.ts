import { Request, Response, NextFunction } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt";
dotenv.config()


const app = express();
const client = new PrismaClient();


app.use(cookieParser());

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});

app.use(express.json());

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await client.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
    const isPasswordMatched = await bcrypt.compare(password,user.password);
    if (!isPasswordMatched) {
      return next(Error("Wrong credentials"))
    }

    let token = jwt.sign(user, process.env.SECRET_KEY as string);

    res.cookie(
      "access_token",
      { user: { id: user.id }, token },
      { httpOnly: true }
    );
    console.log(token)
    return res.status(200).json({ message: "Cookie Set" });
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
});

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY as string);
  } catch {
    return res.sendStatus(403);
  }
};

app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    const user = await client.user.create({
      data: {
        email,
        password:hashPassword,
      },
    });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    const error = new Error("Something went wrong.");
    return next(error);
  }
});