'use strict';

const MongoClient = require('mongodb').MongoClient;

const DEFAULT_URL = 'mongodb://localhost:27017';
const DEFAULT_DB = 'blog';

class DBService {
  static async getDBConnection(url = DEFAULT_URL, dbName = DEFAULT_DB) {
    if (!this._db) {
      this._db = await connect(url, dbName);
    }
    return this._db;
  }
  static async createIndex(collection, ...fields) {
    if (!(await indexExists(collection, fields))) {
      const key = fields.reduce((keyObj, field) => ({ ...keyObj, [field]: 1 }), {});
      collection.createIndex(key);
    }
  }
}

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

const indexExists = async (collection, ...fields) => {
  if (typeof collection === 'string') {
    const db = await DBService.getDBConnection();
    collection = db.collection(collection);
  }
  const indexes = await collection.indexes();
  let counter = 0;
  for (; counter < indexes.length; counter++) {
    const indexFields = Object.keys(indexes[counter].key);
    if (indexFields.length === fields.length &&
      fields.every(field => indexFields.includes(field))) {
      break;
    }
  }
  return counter < indexes.length;
};

module.exports = DBService;
