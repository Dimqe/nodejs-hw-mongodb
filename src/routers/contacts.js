// src/routers/contacts.js

import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,    // Added
  patchContactController,     // Added
  deleteContactController,    // Added
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; // Added

const router = Router();

// We now wrap each controller with ctrlWrapper
router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

// Added new routes
router.post('/contacts', ctrlWrapper(createContactController));

router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;