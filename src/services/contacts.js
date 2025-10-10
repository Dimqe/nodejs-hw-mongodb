// src/services/contacts.js

import { Contact } from '../db/models/contact.js';

// ----- Існуючі сервіси -----

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

// ----- Нові сервіси -----

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true }, // Опція { new: true } повертає оновлений документ
  );
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
  });
  return deletedContact;
};