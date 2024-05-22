import express from "express";
import validateBody  from "../helpers/validateBody.js";
import * as schema from "../services/schemas/contact.js";
import auth from "../helpers/auth.js";


import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, getAllContacts);

contactsRouter.get("/:id", auth, getOneContact);

contactsRouter.delete("/:id", auth, deleteContact);

contactsRouter.post("/", auth, validateBody(schema.createContactSchema), createContact);

contactsRouter.put("/:id", auth, validateBody(schema.updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", auth, updateStatusContact);

export default contactsRouter;
