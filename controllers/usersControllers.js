import * as usersServices from "../services/usersServices.js";
import { User } from "../services/schemas/user.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { sendEmail } from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const { SECRET, BASE_URI } = process.env;

const storeAvatar = path.join(process.cwd(), "public", "avatars");

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  const verificationToken = nanoid();

  const user = await usersServices.findUser(email);
  if (user) {
    return res.status(409).json({
      message: "Email is already in use",
    });
  }
  try {
    const newUser = new User({ email, verificationToken });
    await newUser.setPassword(password);
    await newUser.setAvatarURL(email);
    await newUser.save();

    const verifyEmailData = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URI}/api/users/verify/${verificationToken}">Click verify email</a>`,
    };
    await sendEmail(verifyEmailData);

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
  const verifyPassword = await user?.validPassword(password);

  if (!user || !verifyPassword) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }

  if (!user.verify) {
    return res.status(401).json({ message: "Email not verified" });
  }

  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, SECRET, { expiresIn: "1d" });

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
  const extension = path.extname(originalname);
  const filename = `${_id}${extension}`;
  const resultUpload = path.join(storeAvatar, filename);

  await fs.rename(tempUpload, resultUpload);

  Jimp.read(resultUpload)
    .then((image) => {
      image.cover(250, 250).quality(75).write(resultUpload);
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
      await fs.rm(resultUpload);
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

export const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await usersServices.findUserByVerificationToken(
    verificationToken
  );
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  try {
    await usersServices.updateUser(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await usersServices.findUser(email);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (user.verify) {
    return res.status(400).json({
      message: "Verification has already been passed",
    });
  }

  const verifyEmailData = {
    to: user.email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URI}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmailData);

  res.json({ message: "Verification email sent" });
};
