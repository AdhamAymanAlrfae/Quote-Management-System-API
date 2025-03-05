const Author = require("../Models/authorModel");

const {
  createDoc,
  getOneDoc,
  getAllDoc,
  updateDoc,
  deleteDoc,
  approveDoc,
} = require("./index");

// POST author
exports.createAuthor = createDoc(Author);

// GET author
exports.getOneAuthor = getOneDoc(Author);

// GET all author
exports.getAllAuthors = getAllDoc(Author);

// PUT author
exports.updateAuthor = updateDoc(Author);

// DELETE author
exports.deleteAuthor = deleteDoc(Author);

// APPROVE author
exports.approveAuthor = approveDoc(Author);
