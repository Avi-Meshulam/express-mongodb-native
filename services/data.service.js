'use strict';

const DBService = require('./db.mongo.service');
const { filterObj } = require('../utils');

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

module.exports = DataService;
