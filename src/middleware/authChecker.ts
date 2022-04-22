import { NextFunction, Response } from "express";
import RepositoryService from "../service/repository.service.js";
import { ExReq } from "../types/index.js";

const authChecker = async (req: ExReq, res: Response, next: NextFunction) => {
    try{
        //exptracting user data from headers
        const authHeaders = req.headers.authorization?.split(':');
        if(!authHeaders)
            return res.status(401).json(
                {error: 
                    'unauthorized. Pass your credentials in "Authorization" header in following format: <email>:<paswword>'
                }
            );
        const email = authHeaders[0];
        const password = authHeaders[1];

        //find user by credentials
        const user = await RepositoryService.findByEmailAndPass({ email, password});
        if(!user)
            return res.status(401).json({error: 'User not registered'});

        req.user = user; 
        return next();
    } catch(err) {
        return next(err);
    }
};

export default authChecker;