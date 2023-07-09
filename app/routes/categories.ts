import { Request, Response } from 'express';

const express = require('express');

const CategoriesModel = require('../models/categories');

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['Categorias']
  // #swagger.summary = 'Criar uma categoria'

  try {
    const { name, description } = req.body;

    const data = new CategoriesModel({
      name,
      description,
    });

    const newCategory = await data.save();
    res.status(201).json(newCategory);

  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['Categorias']
  // #swagger.summary = 'Obter as categorias'

  try{
    const list = await CategoriesModel.find();
    res.json(list);   

  } catch(error){
    res.status(400).json({ error: error });
  }
});

router.put('/:id', async (req: Request, res: Response) => {  
  // #swagger.tags = ['Categorias']
  // #swagger.summary = 'Alterar uma categoria'

  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = {
      new: true,
    };

    const result = await CategoriesModel.findByIdAndUpdate(
      id, updatedData, options
    );

    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {  
  // #swagger.tags = ['Categorias']
  // #swagger.summary = 'Deletar uma categoria'

  try {
    const { id } = req.params;
    await CategoriesModel.findByIdAndDelete(id);

    res.status(200);
  } catch (error) {
    res.status(400).json({ error: error });
  }
})

module.exports = router;