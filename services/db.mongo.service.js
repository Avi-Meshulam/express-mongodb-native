'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const DEFAULT_URL = 'mongodb://localhost:27017';
const DEFAULT_DB = 'blog';

class DBService {
  constructor(url = DEFAULT_URL, dbName = DEFAULT_DB) {
    DBService.initDB(url, dbName);
  }

  static async initDB(url = DEFAULT_URL, dbName = DEFAULT_DB) {
    if (!this._db) {
      this._db = await connect(url, dbName);
    }
  }

  static async createIndex(collection, ...fields) {
    const key = fields.reduce((keyObj, field) => ({ ...keyObj, [field]: 1 }), {});
    collection.createIndex(key);
  }

  static getCollection(collectionName) {
    const collection = DBService._db.collection(collectionName);
    assert.notEqual(undefined, collection, `invalid collection name ${collectionName}`);
    return collection;
  }

  isReady() {
    return DBService._db ? true : false;
  }

  async getAll(collectionName) {
    const collection = DBService.getCollection(collectionName);
    return collection.find({}, { projection: { _id: 0 } }).toArray();
  }

  async getById(collectionName, id) {
    const collection = DBService.getCollection(collectionName);
    return collection.findOne({ id }, { projection: { _id: 0 } });
  }

  async getByQuery(collectionName, queryObj) {
    const collection = DBService.getCollection(collectionName);
    return collection.find(queryObj, { projection: { _id: 0 } }).toArray();
  }

  async insert(collectionName, data) {
    const collection = DBService.getCollection(collectionName);
    return collection.insertOne(data);
  }

  async update(collectionName, id, data) {
    const collection = DBService.getCollection(collectionName);
    return collection.updateOne({ id }, { $set: data });
  }

  async remove(collectionName, id) {
    const collection = DBService.getCollection(collectionName);
    return collection.deleteOne({ id });
  }

  async getMax(collectionName, fieldName) {
    const collection = DBService.getCollection(collectionName);
    return (await collection.find().sort({ [fieldName]: -1 }).limit(1).next())[fieldName];
  }
}

/*** Helper Functions ***/
const connect = async (url = DEFAULT_URL, dbName = DEFAULT_DB) => {
  return MongoClient.connect(url, { useNewUrlParser: true })
    .then(client => {
      console.log(`Connected successfully to database ${dbName}`);
      return client.db(dbName);
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

module.exports = DBService;
