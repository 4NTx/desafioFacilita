import { Request, Response, NextFunction } from 'express';
import { clienteSchema } from '../validations/clienteValidacao';

/**
 * Middleware para validar os dados de cadastro do cliente.
 * @param {Request} req - Objeto de requisição do Express.
 * @param {Response} res - Objeto de resposta do Express.
 * @param {NextFunction} next - Próxima função middleware.
 */
export const validarCadastroCliente = (req: Request, res: Response, next: NextFunction) => {
    const { error } = clienteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ mensagem: error.message });
    }
    next();
};
