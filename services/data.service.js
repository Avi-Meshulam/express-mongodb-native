'use strict';

const DBService = require('./db.mongo.service');

const dbService = new DBService();

class DataService {
  constructor(collectionName, idField = 'id', mutableFields = []) {
    this.collectionName = collectionName;
    this.idField = idField;
    this.mutableFields = mutableFields;
  }

  get isReady() {
    return dbService.isReady();
  }

  getAll() {
    return dbService.getAll(this.collectionName);
  }

  getById(id) {
    return dbService.getById(this.collectionName, id);
  }

  getByQuery(queryObj) {
    return dbService.getByQuery(this.collectionName, queryObj);
  }

  async insert(data) {
    let doc = filterObj(data, this.mutableFields); // Optional
    const id = await dbService.getMax(this.collectionName, 'id') + 1;
    await dbService.insert(this.collectionName, { ...doc, id });
    return { id, ...doc };
  }

  async update(id, data) {
    const doc = filterObj(data, this.mutableFields); // Optional
    const result = await dbService.update(this.collectionName, id, { ...doc, id });
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    };
  }

  async remove(id) {
    const result = await dbService.remove(this.collectionName, id);
    return {
      deletedCount: result.deletedCount
    };
  }
}

// returns a copy of the input object with only the specified fields
const filterObj = (obj, fieldsToKeep) => {
  if (!fieldsToKeep || fieldsToKeep.length === 0) {
    return obj;
  }
  const result = {};
  Object.keys(obj).forEach(key => {
    if (fieldsToKeep.includes(key)) {
      result[key] = obj[key];
    }
  });
  return result;
};

module.exports = DataService;
