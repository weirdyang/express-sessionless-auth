const debug = require('debug')('app:journals.controller');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const { errorFormatter } = require('../formatters');
const HttpError = require('../models/http-error');
const Journal = require('../models/journal');
const User = require('../models/user');

const createJournalEntry = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    debug(errors);
    return next(new HttpError('Invalid inputs', 422, errors.array()));
  }
  let newJournal;
  try {
    newJournal = new Journal(req.body);
    newJournal.user = req.user.id;
    await newJournal.save();
    return res.status(200).send({ message: `Entry for ${newJournal.dateOfEntry} saved`, journal: newJournal });
  } catch (error) {
    // return res.json(422).send('Error creating entry, please try again');
    return next(
      new HttpError(error.message, 422),
    );
  }
};

const fetchAllJournals = async (req, res, next) => {
  try {
    const journals = await Journal.find({});

    return res.json({ journals, id: req.user.id });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};

const fetchJournalById = async (req, res, next) => {
  try {
    const journalId = mongoose.Types.ObjectId(req.params.id);
    const journals = await Journal.findById(journalId)
      .populate('user');
    return res.json({ journals, id: req.user.id });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};

const fetchJournalsForUser = async (req, res, next) => {
  try {
    const journals = await Journal.find({ user: req.params.id });
    return res.json({ journals });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};

const updateJournal = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    debug(errors);
    return next(new HttpError('Invalid inputs', 422));
  }
  try {
    const { title, entry, dateOfEntry } = req.body;
    const journalId = mongoose.Types.ObjectId(req.params.id);
    const journal = await Journal.findOneAndUpdate(
      { _id: journalId },
      {
        title,
        entry,
        dateOfEntry,
      },
      { new: true },
    );
    return res.json({ journal, id: req.user.id });
  } catch (error) {
    return next(
      new HttpError(error.message, 500),
    );
  }
};

const deleteJournal = async (req, res) => {
  const journalId = mongoose.Types.ObjectId(req.params.id);
  const journal = await Journal.findByIdAndRemove(journalId);
  if (!journal) {
    return res.status(404).send({ message: 'no such journal' });
  }
  return res.json({ journal });
};
module.exports = {
  createJournalEntry,
  fetchAllJournals,
  fetchJournalById,
  fetchJournalsForUser,
  updateJournal,
  deleteJournal,
};
