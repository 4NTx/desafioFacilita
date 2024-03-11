import Joi from 'joi';

export const clienteSchema = Joi.object({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    telefone: Joi.string().pattern(new RegExp('^[0-9]{10,11}$')),
    coordenada_x: Joi.number().required(),
    coordenada_y: Joi.number().required(),
});
