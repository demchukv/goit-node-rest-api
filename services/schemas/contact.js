import mongoose from "mongoose";
const { Schema } = mongoose;

const contactsShema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
},
{ versionKey: false, timestamps: false }
);

export const Contact = mongoose.model("Contact", contactsShema);
