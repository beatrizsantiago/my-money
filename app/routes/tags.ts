import { Request, Response } from 'express';

const express = require('express');

const router = express.Router()
const TagsModel = require('../models/tags');

router.post('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['Tags']
  // #swagger.summary = 'Criar uma tag'

  try {
    const { name } = req.body;

    if (name.length < 3) {
      return res.status(422).json({ error: 'Nome da tag inválida.' });
    }

    const data = new TagsModel({ name: req.body.name });

    const newTag = await data.save();
    res.status(201).json(newTag);

  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['Tags']
  // #swagger.summary = 'Obter as tags'

  try{
    const list = await TagsModel.find();
    res.json(list);   

  } catch(error){
    res.status(400).json({ error: error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {  
  // #swagger.tags = ['Tags']
  // #swagger.summary = 'Deletar uma tag'

  try {
    const { id } = req.params;
    await TagsModel.findByIdAndDelete(id);

    res.status(200);
  } catch (error) {
    res.status(400).json({ error: error });
  }
})

module.exports = router;