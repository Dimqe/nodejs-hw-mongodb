// src/controllers/contacts.js

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parseFile } from '../utils/parseFile.js'; // Додаємо потрібний імпорт

// ----- Контролери, що не змінюються -----

export const getContactsController = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;
  const filter = { type, isFavourite };

  const contacts = await getAllContacts(userId, { page, perPage, sortBy, sortOrder, filter });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await getContactById(userId, contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// ----- Оновлюємо контролери для роботи з фото -----

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const photo = req.file;

  const photoUrl = photo ? await parseFile(photo) : undefined;

  const contact = await createContact(userId, {
    ...req.body,
    photo: photoUrl, 
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const photo = req.file; 

  
  const photoUrl = photo ? await parseFile(photo) : undefined;

  const payload = { ...req.body };
  
  if (photoUrl) {
    payload.photo = photoUrl;
  }

  const contact = await updateContact(userId, contactId, payload);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};



export const deleteContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await deleteContact(userId, contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};