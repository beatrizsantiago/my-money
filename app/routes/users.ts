import { Request, Response } from 'express';

const express = require('express');
const bcrypt = require("bcryptjs");

const UsersModel = require('../models/users');

const router = express.Router()

router.post("/cadastrar", async (req: Request, res: Response) => {
  // #swagger.tags = ['Usuários']
  // #swagger.summary = 'Criar um usuário'

  try {
    const user = await UsersModel.findOne({ username: req.body.username });
    if (user) {
      return res.status(422).json({ error: 'Usuário já existe.' });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const newUser = await UsersModel.create(req.body);
    res.json(newUser);

  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router