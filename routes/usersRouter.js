import express from "express";
import validateBody  from "../helpers/validateBody.js";
import * as schema from "../services/schemas/user.js";
import auth from "../helpers/auth.js";
import { upload } from "../helpers/upload.js";

import {
    register,
    login,
    logout,
    current,
    updateSubscription,
    updateAvatar
} from "../controllers/usersControllers.js";


const usersRouter = express.Router();

usersRouter.post("/register", validateBody(schema.userValidateSchema), register);

usersRouter.post("/login", validateBody(schema.userValidateSchema), login);

usersRouter.post("/logout", auth, logout);

usersRouter.get("/current", auth, current);

usersRouter.patch("/", auth, validateBody(schema.userValidateSubscription), updateSubscription);

usersRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export default usersRouter;
