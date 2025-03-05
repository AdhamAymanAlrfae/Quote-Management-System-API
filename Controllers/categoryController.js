const Category = require("../Models/categoryModel");

const {
  createDoc,
  getOneDoc,
  getAllDoc,
  updateDoc,
  deleteDoc,
} = require("./index");

exports.createCategory = createDoc(Category);

exports.getOneCategory = getOneDoc(Category);

exports.getAllCategories = getAllDoc(Category);

exports.updateCategory = updateDoc(Category);

exports.deleteCategory = deleteDoc(Category);
