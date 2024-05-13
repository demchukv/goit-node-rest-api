import { Contact } from "./schemas/contact.js";

export async function listContacts() {
  return Contact.find();
}

export async function getContactById(contactId) {
  return Contact.findOne({ _id: contactId });
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete({ _id: contactId });
}

export async function addContact(name, email, phone) {
  return Contact.create({ name, email, phone });
}

export async function updateContact(contactId, body) {
   return Contact.findByIdAndUpdate({ _id: contactId }, body, {returnDocument: "after"});
}

export async function updateStatusContact(contactId, body) {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, {returnDocument: "after"});
}
