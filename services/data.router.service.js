'use strict';

const express = require('express');
const DataService = require('./data.service');

const dataRouter = (collectionName, idField = 'id', mutableFields = []) => {
  const router = express.Router();
  const dataService = new DataService(collectionName, idField, mutableFields);
  
  router
    .all('*', async (req, res, next) => {
      if (!dataService || !dataService.isReady) {
        res.sendStatus(503);  // Service Unavailable
      } else {
        next();
      }
    })

    // GET /{collectionName}/:id
    .get('/:id', async (req, res) => {
      const id = parseInt(req.params.id);
      const doc = await dataService.getById(id);
      res.json(doc);
    })

    // GET /{collectionName}
    .get('/', async (req, res) => {
      const docs = await dataService.getAll();
      res.json(docs);
    })

    // POST
    .post('/', async (req, res) => {
      // send a copy of request's body in order not to change it 
      dataService.insert({ ...req.body })
        .then(doc => res.send(doc));
    })

    // PUT
    .put('/:id', async (req, res) => {
      const id = parseInt(req.params.id);
      dataService.update(id, { ...req.body })
        .then(result => res.send(result));
    })

    // DELETE /{collectionName}/:id
    .delete('/:id', async (req, res) => {
      const id = parseInt(req.params.id);
      dataService.remove(id)
        .then(result => res.send(result));
    });

    return router;
};

module.exports = dataRouter;
