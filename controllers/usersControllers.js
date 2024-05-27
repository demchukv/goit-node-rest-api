import * as usersServices from "../services/usersServices.js";
import { User } from "../services/schemas/user.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { getAvatarName } from "../helpers/upload.js";

const secret = process.env.SECRET;

const storeAvatar = path.join(process.cwd(), "public", "avatars");

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await usersServices.findUser(email);
  if (user) {
    return res.status(409).json({
      message: "Email is already in use",
    });
  }
  try {
    const newUser = new User({ username, email });
    await newUser.setPassword(password);
    await newUser.setAvatarURL(email);
    await newUser.save();
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await usersServices.findUser(email);

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }

  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1d" });

  await usersServices.setUserToken(user._id, { token: token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

export const logout = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await usersServices.setUserToken(_id, { token: null });
    res.status(204).json({});
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const current = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await usersServices.findUserById(_id);
    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  if (
    Object.keys(req.body).length !== 1 ||
    Object.keys(req.body)[0] !== "subscription"
  ) {
    return res.status(400).json({
      message: "Body must have one field: subscription",
    });
  }
  try {
    const data = await usersServices.updateUser(req.user._id, req.body);
    if (!data) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    return res.json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  const filename = getAvatarName(_id, originalname);
  const resultUpload = path.join(storeAvatar, filename);

  try {
    await fs.rename(tempUpload, resultUpload);
  } catch (error) {
    console.error(error);
    next(error);
  }

  Jimp.read(resultUpload)
    .then((image) => {
      return image.contain(250, 250).quality(75).write(resultUpload);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });

  try {
    const data = await usersServices.updateUser(_id, {
      avatarURL: `avatars/${filename}`,
    });
    if (!data) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    return res.json({ avatarURL: `avatars/${filename}` });
  } catch (error) {
    await fs.rm(resultUpload);
    console.error(error);
    next(error);
  }
};
