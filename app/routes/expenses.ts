import { Request, Response } from 'express';

const express = require('express');

const router = express.Router()
const ExpensesModel = require('../models/expenses');
const CategoriesModel = require('../models/categories');

router.post('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Criar uma despesa'

  try {
    const {
      name, value, date, description, categoryId,
    } = req.body;

    const hasCategory = await CategoriesModel.findById(categoryId);
    if (!hasCategory) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    const data = new ExpensesModel({
      name,
      value,
      date,
      description,
      category: categoryId,
    });

    const newExpense = await data.save();
    res.status(201).json(newExpense);

  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Obter as despesas'

  try{
    if (req.query) {
      let {
        page, limit, search, categoryId,
      } = req.query;
    
      let filter: any = {};
    
      if (search) {
        filter.name = { $regex: search, $options: 'i' };
      }
    
      let query = ExpensesModel.find(filter);
      
      if (page && limit) {
        const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
        query = query.skip(skip).limit(parseInt(limit as string, 10));
      }

      if (categoryId) {
        query.find({ category: categoryId });
      }
      
      const list = await query.exec();
      const count = await ExpensesModel.countDocuments(filter);
    
      res.json({
        data: list,
        totalPages: Math.ceil(count / parseInt(limit as string, 10)),
        currentPage: parseInt(page as string, 10)
      });
    } else {
      const list = await ExpensesModel.find();
      res.json(list);
    }    

  } catch(error){
    res.status(400).json({ error: error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Obter uma despesa pelo id'

  try{
    const expense = await ExpensesModel.findById(req.params.id).populate('category');
    res.json(expense);   

  } catch(error){
    res.status(400).json({ error: error });
  }
});

router.put('/:id', async (req: Request, res: Response) => {  
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Alterar uma despesa'

  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = {
      new: true,
    };

    const hasCategory = await CategoriesModel.findById(req.body.categoryId);
    if (!hasCategory) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    const result = await ExpensesModel.findByIdAndUpdate(
      id, updatedData, options
    );

    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {  
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Deletar uma despesa'

  try {
    const { id } = req.params;
    await ExpensesModel.findByIdAndDelete(id);

    res.status(200);
  } catch (error) {
    res.status(400).json({ error: error });
  }
})

module.exports = router;
