'use strict';

const DataService = require('./data.service');

class RouterService {
  constructor(collectionName, idField = 'id', mutableFields = []) {
    this.router = require('express').Router();
    this.dataService = new DataService(collectionName, idField, mutableFields);
    this.initRouter(this.router, this.dataService);
  }

  initRouter(router, data) {
    router
      .all('*', async (req, res, next) => {
        if (!data || !data.isReady) {
          res.sendStatus(503);  // Service Unavailable
        } else {
          next();
        }
      })

      // GET /{collectionName}/:id
      .get('/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const doc = await data.getById(id);
        res.json(doc);
      })

      // GET /{collectionName}
      .get('/', async (req, res) => {
        const docs = await data.getAll();
        res.json(docs);
      })

      // POST
      .post('/', async (req, res) => {
        // send a copy of request's body in order not to change it 
        data.insert({ ...req.body })
          .then(doc => res.send(doc));
      })

      // PUT
      .put('/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        data.update(id, { ...req.body })
          .then(result => res.send(result));
      })

      // DELETE /{collectionName}/:id
      .delete('/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        data.remove(id)
          .then(result => res.send(result));
      });
  }
}

module.exports = RouterService;
