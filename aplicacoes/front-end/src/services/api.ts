import axios from 'axios';
import { IClienteQuery } from '../interfaces/ICliente';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const listarClientes = (params: IClienteQuery) => {
    return api.get('/clientes', { params });
};

export const calcularRota = () => {
    return api.get('/rota');
};

export default api;
