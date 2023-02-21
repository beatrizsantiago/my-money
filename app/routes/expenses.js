const express = require('express');

const router = express.Router()
const ExpensesModel = require('../models/expenses');

router.post('/', async (req, res) => {
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
})

router.get('/', async (req, res) => {
  try{
    if (!req.query.page) {
      const list = await ExpensesModel.find();
      res.json(list);

    } else {
      const { page, limit } = req.query;

      const listWithPagination = await ExpensesModel.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await ExpensesModel.countDocuments();

      res.json({
        data: listWithPagination,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page, 10)
      });
    }

  } catch(error){
    res.status(500).json({ error: error });
  }
})

module.exports = router;