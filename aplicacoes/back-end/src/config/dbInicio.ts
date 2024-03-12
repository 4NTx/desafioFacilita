import { conexao } from './db';

const criarTabelaClientes = `
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    coordenada_x REAL NOT NULL,
    coordenada_y REAL NOT NULL
);`;

/**
 * Verifica e cria a tabela de clientes no banco de dados, se necessário.
 * @returns {Promise<void>}
 */
async function verificarECriarTabelas() {
    try {
        await conexao.query(criarTabelaClientes);
        console.log("Tabela 'clientes' verificada e/ou criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabelas:", error);
        process.exit(1);
    }
}

/**
 * Inicializa o banco de dados, verificando e criando tabelas necessárias.
 * @returns {Promise<void>}
 */
export async function inicializarBancoDeDados() {
    await verificarECriarTabelas();
}
