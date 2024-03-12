export interface ICliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    coordenada_x: number;
    coordenada_y: number;
}

export interface IClienteQuery {
    nome?: string;
    email?: string;
    telefone?: string;
    pagina?: number;
    limite?: number;
}
