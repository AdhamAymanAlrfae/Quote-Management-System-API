const Book = require("../Models/bookModel");

const {
  createDoc,
  getOneDoc,
  getAllDoc,
  updateDoc,
  deleteDoc,
  approveDoc
} = require("./index");


exports.createBook = createDoc(Book);

exports.getOneBook = getOneDoc(Book, "reviews");


exports.getAllBooks = getAllDoc(Book);


exports.updateBook = updateDoc(Book);


exports.deleteBook = deleteDoc(Book);

exports.approveBook = approveDoc(Book);

