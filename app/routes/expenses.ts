import { Request, Response } from 'express';

const express = require('express');

const router = express.Router()
const ExpensesModel = require('../models/expenses');

router.post('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Criar uma despesa'

  try {
    const { name, value, date, description } = req.body;

    const data = new ExpensesModel({
      name,
      value,
      date,
      description,
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
      let { page, limit, search } = req.query;
    
      let filter: any = {};
    
      if (search) {
        filter.name = { $regex: search, $options: 'i' };
      }
    
      let query = ExpensesModel.find(filter);
      const count = ExpensesModel.countDocuments(filter);

      if (page && limit) {
        const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
        query = query.skip(skip).limit(parseInt(limit as string, 10));
      }
    
      const list = await query.exec();
    
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

router.put('/:id', async (req: Request, res: Response) => {  
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Alterar uma despesa'

  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = {
      new: true,
    };

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
