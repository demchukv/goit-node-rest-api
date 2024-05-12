import { Contact } from './schemas/contact.js';

export async function listContacts() {
  return Contact.find();
}

export async function getContactById(contactId) {
  return Contact.findOne({ _id: contactId });
}

export async function removeContact(contactId) {
  return Contact.findByIdAndRemove({ _id: contactId });
}

// export async function addContact(name, email, phone) {
//   const newContact = {
//     id: nanoid(),
//     name,
//     email,
//     phone,
//   };
//   const allContacts = await listContacts();
//   allContacts.push(newContact);
//   await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
//   return newContact;
// }

// export async function updateContact(contactId, body) {
//   const contacts = await listContacts();
//   const index = contacts.findIndex(contact => contact.id === contactId);
//   if (index === -1) {
//     return null;
//   }
//   contacts[index] = { ...contacts[index], ...body };
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return contacts[index];
// }