import type { NextFunction, Request, Response } from "express";
import fs from 'fs';

const logger = async(req:Request, res: Response, next: NextFunction)=>{
    const log = `\nMethod: ${req.method} | URL: ${req.url} | Time: ${Date.now()}\n`
    fs.appendFile("logger.txt", log, (err) => {
        if (err) {
            console.log("Error:", err);
        } else {
            console.log("Log saved successfully!");
        }
    })
    next();
}

export default logger