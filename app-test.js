import express from "express";
import morgan from "morgan";
import cors from "cors";
import usersRouter from "./routes/usersRouter.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json()); // tell express to work with JSON in body
app.use(morgan("dev"));
app.use("/public", express.static("public"));

// routes
app.use("/api/users", usersRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

// error handling
app.use((error, req, res, next) => {
  console.error("Handling errors: ", error.message, error.name);

  // handle mongoose validation error
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: error.message,
    });
  }

  // handle ObjectId validation
  if (error.message.includes("Cast to ObjectId failed for value")) {
    return res.status(400).json({
      message: "id is invalid",
    });
  }

  if (error.status) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
