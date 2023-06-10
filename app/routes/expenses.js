const express = require('express');

const router = express.Router()
const ExpensesModel = require('../models/expenses');

router.post('/', async (req, res) => {
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

router.get('/', async (req, res) => {
  // #swagger.tags = ['Despesas']
  // #swagger.summary = 'Obter as despesas'

  try{
    if (req.query) {
      let { page, limit, search } = req.query;
    
      let query = {};
    
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
    
      const count = await ExpensesModel.countDocuments(query);
    
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
    
      const startIndex = (page - 1) * limit;
    
      let list = await ExpensesModel.find(query)
        .skip(startIndex)
        .limit(limit);
    
      res.json({
        data: list,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } else {
      const list = await ExpensesModel.find();
      res.json(list);
    }    

  } catch(error){
    res.status(400).json({ error: error });
  }
});

router.put('/:id', async (req, res) => {  
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

router.delete('/:id', async (req, res) => {  
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