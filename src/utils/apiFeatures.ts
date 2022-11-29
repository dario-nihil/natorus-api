import { Request } from 'express';

class APIFeatures {
  constructor(public query: any, public queryString: Request) {}

  filter() {
    const queryObj = { ...this.queryString.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((elm) => delete queryObj[elm]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.query.sort) {
      const sortBy = (this.queryString.query.sort as string)
        .split(',')
        .join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.query.fields) {
      const fields = (this.queryString.query.fields as string)
        .split(',')
        .join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = +(this.queryString.query.page || 1);
    const limit = +(this.queryString.query.limit || 100);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
