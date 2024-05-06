import express from "express";
import validateBody  from "../helpers/validateBody.js";
import * as schema from "../schemas/contactsSchemas.js";


import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(schema.createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(schema.updateContactSchema), updateContact);

export default contactsRouter;
