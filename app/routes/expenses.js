const express = require('express');

const router = express.Router()
const Model = require('../models/expenses');

router.post('/', async (req, res) => {
  try {
    const { name, value, date, description } = req.body;

    const data = new Model({
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
      const data = await Model.find();
      res.json(data);

  } catch(error){
      res.status(500).json({ error: error });
  }
})

module.exports = router;