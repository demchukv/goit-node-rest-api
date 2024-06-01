import mongoose from "mongoose";
import bCrypt from "bcrypt";
import Joi from "joi";
import gravatar from "gravatar";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.methods.setPassword = async function (password) {
  this.password = await bCrypt.hash(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = async function (password) {
  return await bCrypt.compare(password, this.password);
};

userSchema.methods.setAvatarURL = async function (email) {
  this.avatarURL = gravatar.url(email, { s: "250" });
};

export const User = mongoose.model("User", userSchema);

export const userValidateSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

export const userValidateSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const userValidateVerifyEmail = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});
