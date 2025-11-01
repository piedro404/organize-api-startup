import { Request, Response, NextFunction, response } from 'express';
import { logger } from '../config/logger.js';
import { success } from 'src/utils/response.js';

export async function home(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = success(
        'API is running', 
        { 
            name: 'OrgaNize API', 
            version: '1.0.0', 
            description: 'API para o sistema de organização de tarefas',
            docsUrl: '/',
            authors: [
                { 
                    name: 'Pedro Henrique Martins Borges', 
                    github: 'https://github.com/piedro404',
                    picture: 'https://avatars.githubusercontent.com/u/88720549?v=4'
                },
                { 
                    name: 'Matheus Augusto', 
                    github: 'https://github.com/Matheuz233',
                    picture: 'https://avatars.githubusercontent.com/u/138679799?v=4'
                },
            ],
        }
    );

    return res.json(response);
  } catch (err) {
    return next(err);
  }
}
