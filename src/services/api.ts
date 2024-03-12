import axios from 'axios';
import { IClienteQuery } from '../interfaces/ICliente';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export const listarClientes = (params: IClienteQuery) => {
    return api.get('/clientes', { params });
};

export const calcularRota = () => {
    return api.get('/rota');
};

export default api;
