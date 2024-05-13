import mongoose from "mongoose";
const { Schema } = mongoose;

const contactsShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be less than 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
      validate: {
        validator: function (v) {
          return /^\([0-9]{3}\) [0-9]{3}\-[0-9]{4}$/.test(v);
        },
        message:
          "The phone number must contain 10 digits in the format: (099) 999-9999",
      },
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: false }
);

export const Contact = mongoose.model("Contact", contactsShema);
