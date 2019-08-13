'use strict';

const { filterObj } = require('../utils');
const DBService = require('./db.service');

class DataService {
  constructor(collectionName, collectionFields = []) {
    DBService.getDBConnection().then(db => {
      this._collection = db.collection(collectionName);
    });
    this._collectionFields = collectionFields;
  }

  get isReady() {
    return this._collection ? true : false;
  }

  async getAll() {
    return this._collection.find({}, { projection: { _id: 0 } }).toArray();
  }

  async getById(id) {
    return this._collection.findOne({ id }, { projection: { _id: 0 } });
  }

  async getByQuery(queryObj) {
    return this._collection.find(queryObj, { projection: { _id: 0 } }).toArray();
  }

  async insert(data) {
    let doc = filterObj(data, this._collectionFields); // Optional
    const id = await this.getNextId();
    await this._collection.insertOne({ ...doc, id });
    return { id, ...doc };
  }

  async update(id, data) {
    const doc = filterObj(data, this._collectionFields); // Optional
    const result = await this._collection.updateOne({ id }, { $set: { ...doc, id } });
    return {
      matchedCount: result.matchedCount,
      updatedCount: result.modifiedCount
    };
  }

  async remove(id) {
    const result = await this._collection.deleteOne({ id });
    return { deletedCount: result.deletedCount };
  }

  async getNextId(fieldName = 'id') {
    const maxId = (await this._collection.find().sort({ [fieldName]: -1 }).limit(1).next())[fieldName];
    return maxId + 1;
  }
}

module.exports = DataService;
