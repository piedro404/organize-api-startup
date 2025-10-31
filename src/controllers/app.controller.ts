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
            name: 'Adote Pets API', 
            version: '1.0.0', 
            description: 'API para o sistema de adoção de pets',
            docsUrl: '/docs',
            organization: 'Sonata dos Bytes',
            organizationUrl: 'https://github.com/Sonata-dos-Bytes',
            authors: [
                { 
                    name: 'Erikli Arruda' , 
                    github: 'https://github.com/Erikli999',
                    picture: 'https://avatars.githubusercontent.com/u/138739176?v=4'
                },
                { 
                    name: 'Pedro Henrique Martins Borges', 
                    github: 'https://github.com/piedro404',
                    picture: 'https://avatars.githubusercontent.com/u/88720549?v=4'
                },
                { 
                    name: 'Guilherme Felipe', 
                    github: 'https://github.com/guilherme-felipe123',
                    picture: 'https://avatars.githubusercontent.com/u/115903669?v=4'
                },
                { 
                    name: 'Luan Jacomini Kloh', 
                    github: 'https://github.com/luanklo',
                    picture: 'https://avatars.githubusercontent.com/u/53999727?v=4'
                },
                { 
                    name: 'Matheus Augusto', 
                    github: 'https://github.com/Matheuz233',
                    picture: 'https://avatars.githubusercontent.com/u/138679799?v=4'
                },
                { 
                    name: 'Thayna Bezerra', 
                    github: 'https://github.com/thayna-bezerra',
                    picture: 'https://avatars.githubusercontent.com/u/58120519?v=4'
                },
            ],
        }
    );

    return res.json(response);
  } catch (err) {
    return next(err);
  }
}
