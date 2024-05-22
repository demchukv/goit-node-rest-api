import { Contact } from "./schemas/contact.js";

export async function listContacts(owner, page, limit, favorite) {
  const skip = (page - 1) * limit;
  const filterParams = { owner };
  if(favorite === "true"){
    filterParams.favorite = true;
  }
  console.log(filterParams);
  return Contact.find(filterParams, "", {skip, limit}).populate("owner", "email subscription");
}

export async function getContactById(contactId) {
  return Contact.findOne({ _id: contactId });
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete({ _id: contactId });
}

export async function addContact(name, email, phone, owner) {
  return Contact.create({ name, email, phone, owner });
}

export async function updateContact(contactId, body) {
   return Contact.findByIdAndUpdate({ _id: contactId }, body, {new: true});
}

export async function updateStatusContact(contactId, body) {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, {new: true});
}
