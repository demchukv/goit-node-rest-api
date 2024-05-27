import * as contactsServices from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const {page = 1, limit = 20, favorite = "false"} = req.query;
    const results = await contactsServices.listContacts(owner, page, limit, favorite);
    return res.json(results);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const data = await contactsServices.getContactById(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    if (data.owner.toString() !== req.user._id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    return res.json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const data = await contactsServices.removeContact(req.params.id);
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

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const owner = req.user._id;
    const data = await contactsServices.addContact(name, email, phone, owner);
    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Body must have at least one field",
    });
  }
  try {
    const data = await contactsServices.updateContact(req.params.id, req.body);
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

export const updateStatusContact = async (req, res, next) => {
  if(Object.keys(req.body).length !== 1 || typeof req.body.favorite !== 'boolean') {
    return res.status(400).json({
        message: "Body must have one boolean field: favorite",
      });
  }
  try {
    const data = await contactsServices.updateStatusContact(
      req.params.id,
      req.body
    );
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
