import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import contactsRouter from "./routes/contactsRouter.js";

dotenv.config();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Internal server error" } = err;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb, {});

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Database connection successful`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
