
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filtering
  filter() {
    const filterObject = { ...this.queryString };
    const exclude = ["page", "limit", "sort", "fields", "search"];
    exclude.forEach((field) => delete filterObject[field]);

    let strObject = JSON.stringify(filterObject);
    let filter = JSON.parse(
      strObject.replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`)
    );

    this.query = this.query.find(filter);
    return this;
  }

  // Search
  search(fields) {
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search, "i"); // case-insensitive search
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: searchRegex })),
      });
    }
    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = Math.min(parseInt(this.queryString.limit) || 10, 100);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
