const express = require('express');
const { check } = require('express-validator');

const {
  createJournalEntry,
  fetchAllJournals,
  fetchJournalById,
  fetchJournalsForUser,
  updateJournal,
  deleteJournal,
} = require('../controllers/journal.controller');

const { auth } = require('./auth.routes');

const router = express.Router();
const reqChecks = [
  check('title').not().isEmpty().bail(),
  check('entry').not().isEmpty().bail(),
  check('dateOfEntry').isDate(),
];
// all requests must be authenticated
router.use(auth.jwt);

// create new journal
router.post('/create', reqChecks, createJournalEntry);

// return all journals
router.get('/', fetchAllJournals);
// get specific journal
router.get('/:id', fetchJournalById);
// get journals for user
router.get('/user/:id', fetchJournalsForUser);
// update journal entry
router.put('/:id', reqChecks, updateJournal);
// delete
router.delete('/:id', deleteJournal);

module.exports = router;
