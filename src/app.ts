import 'reflect-metadata'
import express from 'express';
import "./database";
import { Request, Response, NextFunction } from "express";
import "express-async-errors";
import { router } from './routes';
import { createConnection } from 'typeorm';
import { AppError } from './errors/AppErrors';


createConnection();
const app = express ();

app.use(express.json())
app.use(router);

app.use(
    (err: Error, request: Request, response: Response, _next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                message: err.message,
            });
        }
        
        return response.status(500).json({
            status: "Error",
            message: `Internal server error occurred: ${err.message}`
        })
    }
)

export { app }
