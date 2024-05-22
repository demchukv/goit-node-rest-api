import mongoose from "mongoose";
import Joi from "joi";
const { Schema } = mongoose;


const contactsShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  { versionKey: false, timestamps: true }
);

export const Contact = mongoose.model("Contact", contactsShema);

export const createContactSchema = Joi.object({
  name: Joi.string()
      .min(3)
      .max(30)
      .required(),
  email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
  phone: Joi.string()
      .regex(/^\([0-9]{3}\) [0-9]{3}\-[0-9]{4}$/).messages({'string.pattern.base': 'Номер телефону повинен містити 10 цифр у форматі: (099) 999-9999.'})
      .required()
})

export const updateContactSchema = Joi.object({
  name: Joi.string()
      .min(3)
      .max(30),
  email: Joi.string()
      .email({ minDomainSegments: 2 }),
  phone: Joi.string()
      .regex(/^\([0-9]{3}\) [0-9]{3}\-[0-9]{4}$/).messages({'string.pattern.base': 'Номер телефону повинен містити 10 цифр у форматі: (099) 999-9999.'})
})