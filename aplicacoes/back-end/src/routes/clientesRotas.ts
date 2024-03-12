import { Router } from 'express';
import { listarClientes, cadastrarCliente, calcularRota } from '../controllers/clientesController';
import { validarCadastroCliente } from '../middlewares/validarCadastroCliente';

const router = Router();

router.get('/clientes', listarClientes);

router.post('/clientes', validarCadastroCliente, cadastrarCliente);

router.get('/rota', calcularRota);

export default router;
