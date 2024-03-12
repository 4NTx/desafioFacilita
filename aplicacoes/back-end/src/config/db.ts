import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const conexao = new Pool({
    user: process.env.DB_USUARIO,
    host: process.env.DB_HOST,
    database: process.env.DB_NOME,
    password: process.env.DB_SENHA,
    port: parseInt(process.env.DB_PORTA || '5432'),
});
