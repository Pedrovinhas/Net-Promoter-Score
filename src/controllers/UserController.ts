import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup'
import { AppError } from '../errors/AppErrors';

class UserController {

    async create(request: Request, response: Response) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required("Nome é obrigatório"),
            email: yup.string().email().required("Email incorreto")
        })

        if(!(await schema.isValid(request.body))) {
            throw new AppError("Validation Failed!")
        }
        
        const usersRepository = getCustomRepository(UsersRepository);

        // SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        const userAlreadyExists = await usersRepository.findOne({ 
            email 
        });;

        if(userAlreadyExists) {
            throw new AppError("User already exists");
        }

        const user = usersRepository.create({
            name, email
        })

        await usersRepository.save (user);

        return response.status(201).json(user);
    }
}


export { UserController };
