import { Request, Response, NextFunction } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt";
import router from "./route";
dotenv.config()


const app = express();
const client = new PrismaClient();
app.use(router);


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
      { token },
      { httpOnly: true }
    );
    console.log(token)
    return res.status(200).json({ message: "Cookie Set" });
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
});

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const token =  req.body.token || req.headers["access_token"];
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
 

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
   await auth(req, res, next);
  try {
    if (req.body.role != "Admin")
      return res.status(401).send("Access Denied");
    next();
  } catch {
    return res.sendStatus(403);
   }
 };
  
 app.post("/admin", auth, verifyUser,(req, res) => {
   res.status(200).send("Welcome");
 });
 

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
