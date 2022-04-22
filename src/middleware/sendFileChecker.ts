import { NextFunction, Response } from "express";
import RepositoryService from "../service/repository.service.js";
import { ExReq } from "../types/index.js";

const sendFileChecker = async (req: ExReq, res: Response, next: NextFunction) => {
    try{
        const { recepientId } = req.params;
        if(!recepientId)
            return res.status(400).json({error: 'Set recepient id as request param'});
        const recepient = await RepositoryService.findUserById(+recepientId);
        if(!recepient)
            return res.status(404).json({ error: 'Recepient not found'});
        
        return next();
    } catch(err) {
        return next(err);
    }
};

export default sendFileChecker;