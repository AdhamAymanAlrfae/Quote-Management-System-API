const Category = require("../Models/categoryModel");

const {
  createDoc,
  getOneDoc,
  getAllDoc,
  updateDoc,
  deleteDoc,
  approveDoc
} = require("./index");

exports.createCategory = createDoc(Category);

exports.getOneCategory = getOneDoc(Category);

exports.getAllCategories = getAllDoc(Category);

exports.updateCategory = updateDoc(Category);

exports.deleteCategory = deleteDoc(Category);

exports.approveCategory = approveDoc(Category);