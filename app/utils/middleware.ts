import { Request, Response, NextFunction } from 'express';

require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");

const authenticateMiddleware = async (req:Request, res:Response, next:NextFunction) => {
  try {
    if (req.headers.authorization) {

      const token = req.headers.authorization.split(" ")[1];
      if (token) {

        const payload = await jwt.verify(token, process.env.TOKEN_SECRET);
        if (payload) {

          // @ts-ignore
          req.user = payload;
          next();

        } else {
          res.status(400).json({ error: "Falha na verificação do token" });
        }
      } else {
        res.status(400).json({ error: "Header malformado." });
      }
    } else {
      res.status(400).json({ error: "Não existe autorização no header" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  authenticateMiddleware,
};