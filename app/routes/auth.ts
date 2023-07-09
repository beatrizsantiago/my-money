import { Request, Response } from 'express';

require("dotenv").config();

const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UsersModel = require('../models/users');

const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
  // #swagger.tags = ['Autenticação']
  // #swagger.summary = 'Realizar login'

  try {
    const user = await UsersModel.findOne({ username: req.body.username });
    if (user) {
      
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {

        const token = await jwt.sign({ username: user.username }, process.env.TOKEN_SECRET);
        res.json({ token });

      } else {
        res.status(400).json({ error: "Usuário e/ou senha inválidos" });
      }

    } else {
      res.status(400).json({ error: "Usuário e/ou senha inválidos" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router