import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth_route";
import categoryRouter from "./routes/category_route";
import productRouter from "./routes/product_route";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("server is listening on port 5000");
});
