import { Request, Response } from 'express';

const express = require('express');
const bcrypt = require('bcrypt');

const UsersModel = require('../models/users');
const auth = require('../helpers/jwt.ts')

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
  // #swagger.tags = ['Autenticação']
  // #swagger.summary = 'Realizar login'

  try {
    const { username, password } = req.body;

    const user = await UsersModel.findOne({ username });
    if (!user) {
      return res.status(400).send('E-mail ou senha inválido.');
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).send('E-mail ou senha inválido.');
    }

    const token = auth.generateAccessToken(username);
    res.header("auth-token", token).send(token);

  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.post('/cadastrar', async (req: Request, res: Response) => {
  // #swagger.tags = ['Autenticação']
  // #swagger.summary = 'Realizar cadastro'

  try {
    const { username, password } = req.body;

    const userExists = await UsersModel.findOne({ username });
    if (userExists) {
      return res.status(400).send('Este nome de usuário não está disponível');
    }

    const salt = await bcrypt.genSalt(10);  
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new UsersModel({
      username,
      password: hashPassword,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);

  } catch (error) {
    res.status(400).json({ error: error });
  }
});