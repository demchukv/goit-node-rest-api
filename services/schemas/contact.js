import mongoose from "mongoose";
const { Schema } = mongoose;

const contactsShema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: [true, "Set email for contact"],
  },
  phone: {
    type: String,
    required: [true, "Set phone for contact"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
},
{ versionKey: false, timestamps: true }
);

export const Contact = mongoose.model("Contact", contactsShema);
