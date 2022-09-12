import { Router } from "express";
import { loginUser } from "../controllers/auth_controller";
import { signupUser } from "../controllers/auth_controller";
const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.post("/signup", signupUser);

export default authRouter;
