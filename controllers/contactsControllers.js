import * as contactsServices from "../services/contactsServices.js";

export const getAllContacts = async (_, res, next) => {
  try {
    const results = await contactsServices.listContacts();
    return res.json(results);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOneContact = async (req, res) => {
  const data = await contactsServices.getContactById(req.params.id);
  if (!data) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  return res.json(data);
};

export const deleteContact = async (req, res) => {
  const data = await contactsServices.removeContact(req.params.id);
  if (!data) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  return res.json(data);
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const data = await contactsServices.addContact(name, email, phone);
  return res.status(201).json(data);
};

export const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Body must have at least one field",
    });
  }
  const data = await contactsServices.updateContact(req.params.id, req.body);
  if (!data) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  return res.json(data);
};
