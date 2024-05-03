import * as contactsServices from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    return res.json({
        status: "success",
        code: 200,
        data: await contactsServices.listContacts()
});
};

export const getOneContact = async (req, res) => {
    const data = await contactsServices.getContactById(req.params.id);
    if(!data) {
        return res.status(404).json({
            status: "error",
            code: 404,
            message: "Not found"
        })
    }
    return res.json({
        status: "success",
        code: 200,
        data: data
    })
};

export const deleteContact = async (req, res) => {
    const data = await contactsServices.removeContact(req.params.id);
    if(!data) {
        return res.status(404).json({
            status: "error",
            code: 404,
            message: "Not found"
        })
    }
    return res.json({
        status: "success",
        code: 200,
        data: data
    })
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    const data = await contactsServices.addContact(name, email, phone);
    return res.status(201).json({
        status: "success",
        code: 201,
        data: data
    })
};

export const updateContact = async (req, res) => {
    if(Object.keys(req.body).length === 0){
        return res.status(400).json({
            status: "error",
            code: 400,
            message: "Body must have at least one field"
        })
    }
    const data = await contactsServices.updateContact(req.params.id, req.body);
    if(!data) {
        return res.status(404).json({
            status: "error",
            code: 404,
            message: "Not found"
        })
    }
    return res.json({
        status: "success",
        code: 200,
        data: data
    })
};
