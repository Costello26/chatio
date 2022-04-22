import chalk from "chalk";
import { ErrorRequestHandler, NextFunction, Response } from "express";
import { ExReq } from "../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorLogger: ErrorRequestHandler = (err: Error, req: ExReq, res: Response, _next: NextFunction) => {
    console.log(chalk.underline.red(err));
    res.status(500).json({error: 'Internal server error'});
};

export default errorLogger;