import { Request, Response } from 'express';

const express = require('express');

const ExpensesModel = require('../models/expenses');
const CategoriesModel = require('../models/categories');
const TagsModel = require('../models/tags');

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Criar uma despesa'

  try {
    const {
      name, value, date, description, categoryId,
    } = req.body;

    const category = await CategoriesModel.findById(categoryId);
    if (!category) {
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
    const expense = await ExpensesModel.findById(req.params.id)
      .populate('category')
      .populate('tags');

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
    const bodyData = req.body;
    const options = {
      new: true,
    };

    const category = await CategoriesModel.findById(req.body.categoryId);
    if (req.body.categoryId && !category) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    const expense = await CategoriesModel.findById(id);
    
    const updatedData = {
      ...expense,
      ...bodyData,
    }

    const result = await ExpensesModel.findByIdAndUpdate(
      id, updatedData, options
    );

    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.put('/:expenseId/adicionar-tag/:tagId', async (req: Request, res: Response) => {  
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Adicionar uma tag a uma despesa'

  try {
    const { expenseId, tagId } = req.params;

    const expense = await ExpensesModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    const tag = await TagsModel.findById(tagId);
    if (!tag) {
      return res.status(400).json({ error: 'A tag não existe' });
    }

    const tagExists = expense.tags.includes(tag._id);
    if (tagExists) {
      return res.status(400).json({ error: 'A tag já existe na despesa' });
    }

    const result = await ExpensesModel.findOneAndUpdate(
      { _id: expenseId },
      { $push: { tags: tag._id } },
      { new: true }
    );

    res.send(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.put('/:expenseId/remover-tag/:tagId', async (req: Request, res: Response) => {  
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Adicionar uma tag a uma despesa'

  try {
    const { expenseId, tagId } = req.params;

    const expense = await ExpensesModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    const tag = await TagsModel.findById(tagId);
    if (!tag) {
      return res.status(400).json({ error: 'A tag não existe' });
    }

    const tagIndex = expense.tags.indexOf(tag._id);
    if (tagIndex === -1) {
      return res.status(400).json({ error: 'A tag não existe na despesa' });
    }

    const result = await ExpensesModel.findOneAndUpdate(
      { _id: expenseId },
      { $pull: { tags: tag._id } },
      { new: true }
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
