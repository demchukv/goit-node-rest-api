import express from "express";
import validateBody from "../helpers/validateBody.js";
import * as schema from "../services/schemas/user.js";
import auth from "../helpers/auth.js";
import { upload } from "../helpers/upload.js";

import * as ctrl from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(schema.userValidateSchema),
  ctrl.register
);

usersRouter.get("/verify/:verificationToken", ctrl.verifyEmail);

usersRouter.post("/verify", validateBody(schema.userValidateVerifyEmail), ctrl.resendVerifyEmail);

usersRouter.post("/login", validateBody(schema.userValidateSchema), ctrl.login);

usersRouter.post("/logout", auth, ctrl.logout);

usersRouter.get("/current", auth, ctrl.current);

usersRouter.patch(
  "/",
  auth,
  validateBody(schema.userValidateSubscription),
  ctrl.updateSubscription
);

usersRouter.patch("/avatars", auth, upload.single("avatar"), ctrl.updateAvatar);

export default usersRouter;
