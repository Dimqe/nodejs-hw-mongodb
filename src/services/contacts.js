
import { Contact } from '../db/models/contact.js';

export const getAllContacts = async (userId, { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filter = {} }) => {
  const skip = (page - 1) * perPage;
  const baseFilter = { userId };

  if (filter.type) {
    baseFilter.contactType = filter.type;
  }
  if (filter.isFavourite) {
    baseFilter.isFavourite = filter.isFavourite;
  }

  const query = Contact.find(baseFilter);

  const totalItems = await Contact.countDocuments(baseFilter);
  const totalPages = Math.ceil(totalItems / perPage);

 
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const data = await query
    .sort({ [sortBy]: sortOrder })
    .collation({ locale: 'en', strength: 2 })
    .skip(skip)
    .limit(perPage);

  
  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};


export const getContactById = async (userId, contactId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (userId, payload) => {
  const contact = await Contact.create({ ...payload, userId });
  return contact;
};

export const updateContact = async (userId, contactId, payload) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
  return updatedContact;
};

export const deleteContact = async (userId, contactId) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return deletedContact;
};