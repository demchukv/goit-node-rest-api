import mongoose from "mongoose";
import bCrypt from "bcrypt";
import Joi from "joi";

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
  },
  { versionKey: false, timestamps: true }
);

userSchema.methods.setPassword = async function (password) {
  this.password = await bCrypt.hash(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = async function (password) {
  return await bCrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);

export const userValidateSchema = Joi.object({
  password: Joi.string()
      .min(6)
      .max(15)
      .required(),
  email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
  subscription: Joi.string()
      .valid("starter", "pro", "business"),
})

export const userValidateSubscription = Joi.object({
  subscription: Joi.string()
  .valid("starter", "pro", "business")
  .required(),
})