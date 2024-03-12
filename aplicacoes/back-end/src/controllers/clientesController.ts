import { Request, Response } from 'express';
import { conexao } from '../config/db';
import { clienteSchema } from '../validations/clienteValidacao';


/**
 * Interface para consulta de clientes.
 * @interface
 * @property {string} [nome] - Nome do cliente a ser pesquisado.
 * @property {string} [email] - Email do cliente a ser pesquisado.
 * @property {string} [telefone] - Telefone do cliente a ser pesquisado.
 */
interface IClienteQuery {
    nome?: string;
    email?: string;
    telefone?: string;
}

/**
 * Interface para dados do cliente.
 * @interface
 * @property {number} id - id do cliente.
 * @property {string} nome - Nome do cliente.
 * @property {string} email - Email do cliente.
 * @property {string} telefone - Número de telefone do cliente.
 * @property {number} coordenada_x - Coordenada x do cliente.
 * @property {number} coordenada_y - Coordenada y do cliente.
 */
interface ICliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    coordenada_x: number;
    coordenada_y: number;
}


/**
 * Cadastra um novo cliente.
 * @param {Request} req - Objeto de requisição do Express.
 * @param {Response} res - Objeto de resposta do Express.
 * @returns {Promise<void>}
 */
export const cadastrarCliente = async (req: Request, res: Response): Promise<void> => {
    const { value, error } = clienteSchema.validate(req.body);
    if (error) {
        res.status(400).json({ mensagem: "Dados de entrada inválidos", detalhes: error.details });
        return;
    }

    const { nome, email, telefone, coordenada_x, coordenada_y }: ICliente = value;
    const queryVerificarEmail = 'SELECT COUNT(*) FROM clientes WHERE email = $1';
    const queryInserirCliente = 'INSERT INTO clientes(nome, email, telefone, coordenada_x, coordenada_y) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    try {
        const { rows } = await conexao.query(queryVerificarEmail, [email]);
        const emailExiste = parseInt(rows[0].count, 10);
        if (emailExiste > 0) {
            res.status(400).json({ mensagem: "O email já está cadastrado" });
            return;
        }
        await conexao.query(queryInserirCliente, [nome, email, telefone, coordenada_x, coordenada_y]);
        res.status(201).json({ mensagem: "Cliente cadastrado com sucesso" });
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ mensagem: "Erro interno no servidor", error });
    }
};



/**
 * Lista clientes.
 * @param {Request} req - Objeto de requisição do Express.
 * @param {Response} res - Objeto de resposta do Express.
 * @returns {Promise<void>}
 */
export const listarClientes = async (req: Request, res: Response): Promise<void> => {
    const { nome, email, telefone } = req.query as IClienteQuery;
    const pagina: number = parseInt(req.query.pagina as string) || 1;
    const limite: number = parseInt(req.query.limite as string) || 10;
    const deslocamento = (pagina - 1) * limite;

    let queryBase = 'SELECT * FROM clientes';
    const condicoes: string[] = [];
    const valores: (string | undefined)[] = [];

    if (nome) {
        condicoes.push(`nome LIKE '%' || $${condicoes.length + 1} || '%'`);
        valores.push(nome);
    }
    if (email) {
        condicoes.push(`email = $${condicoes.length + 1}`);
        valores.push(email);
    }
    if (telefone) {
        condicoes.push(`telefone = $${condicoes.length + 1}`);
        valores.push(telefone);
    }

    if (condicoes.length > 0) {
        queryBase += ' WHERE ' + condicoes.join(' AND ');
    }

    const queryComPaginacao = `${queryBase} LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}`;

    try {
        const { rows } = await conexao.query(queryComPaginacao, [...valores, limite, deslocamento]);

        const queryTotal = `SELECT COUNT(*) FROM (${queryBase}) AS total`;
        const resultadoTotal = await conexao.query(queryTotal, valores);
        const totalItens = parseInt(resultadoTotal.rows[0].count);
        const totalPaginas = Math.ceil(totalItens / limite);

        res.json({
            dados: rows,
            pagina,
            itensPorPagina: limite,
            totalItens,
            totalPaginas
        });
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};



/**
 * Calcula a distância entre dois pontos.
 * @param {number} x1 - Coordenada x do primeiro ponto.
 * @param {number} y1 - Coordenada y do primeiro ponto.
 * @param {number} x2 - Coordenada x do segundo ponto.
 * @param {number} y2 - Coordenada y do segundo ponto.
 * @returns {number} Distância entre os pontos.
 */
function calcularDistancia(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}


/**
 * Encontra o cliente mais próximo do ponto atual.
 * @param {ICliente} pontoAtual - Ponto de referência atual.
 * @param {ICliente[]} clientes - Lista de clientes restantes para visitar.
 * @returns {ICliente | undefined} O cliente mais próximo do ponto atual, ou undefined se todos os clientes já foram visitados.
 */
function encontrarClienteMaisProximo(pontoAtual: ICliente, clientes: ICliente[]): ICliente | undefined {
    let indiceClienteMaisProximo: number | undefined;
    let distanciaMinima = Infinity;

    clientes.forEach((cliente, indice) => {
        const distancia = calcularDistancia(pontoAtual.coordenada_x, pontoAtual.coordenada_y, cliente.coordenada_x, cliente.coordenada_y);
        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            indiceClienteMaisProximo = indice;
        }
    });

    if (indiceClienteMaisProximo !== undefined) {
        return clientes.splice(indiceClienteMaisProximo, 1)[0];
    }
}

/**
 * Calcula a rota dos clientes a partir da localização da empresa.
 * @param {Request} req - Objeto de requisição do Express.
 * @param {Response} res - Objeto de resposta do Express.
 * @returns {Promise<void>} Uma promessa que, quando resolvida, envia a rota calculada como resposta.
 */
export const calcularRota = async (req: Request, res: Response): Promise<void> => {
    try {
        const resultadoClientes = await conexao.query<ICliente>('SELECT id, nome, coordenada_x, coordenada_y FROM clientes');
        let clientes = resultadoClientes.rows;

        const empresa: ICliente = {
            id: 0,
            nome: process.env.EMPRESA_NOME || 'Empresa',
            email: '',
            telefone: '',
            coordenada_x: parseFloat(process.env.EMPRESA_COORDENADA_X || '0'),
            coordenada_y: parseFloat(process.env.EMPRESA_COORDENADA_Y || '0')
        }; let rota: ICliente[] = [empresa];
        let pontoAtual = empresa;

        while (clientes.length > 0) {
            const proximoCliente = encontrarClienteMaisProximo(pontoAtual, clientes);
            if (proximoCliente) {
                rota.push(proximoCliente);
                pontoAtual = proximoCliente;
            }
        }
        rota.push(empresa);

        res.json({ rota });
    } catch (error) {
        console.error('Erro ao calcular rota:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};