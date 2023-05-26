import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./Routers/userRouter.js";
import productRouter from "./Routers/productRouter.js";
import basketRouter from "./Routers/basketRouter.js"
import addressRouter from './Routers/addressRouter.js'
import favoriteRouter from './Routers/favoritesRouter.js'
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", userRouter);
app.use("/products", productRouter);
app.use("/basket", basketRouter)
app.use('/address', addressRouter)
app.use('/favorites', favoriteRouter)

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STRING)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
});
