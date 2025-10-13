

import { Contact } from '../db/models/contact.js';


export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;


  const contactsQuery = Contact.find();

 
  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

 
  const totalItems = await Contact.countDocuments(contactsQuery);


  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

 
  const data = await contactsQuery
    .sort({ [sortBy]: sortOrder })
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


export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true },
  );
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
  });
  return deletedContact;
};