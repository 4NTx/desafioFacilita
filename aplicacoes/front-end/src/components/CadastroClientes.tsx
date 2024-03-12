import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ClienteForm {
    nome: string;
    email: string;
    telefone: string;
    coordenada_x: number;
    coordenada_y: number;
}

const emailRegex = /\S+@\S+\.\S+/;
const telefoneRegex = /^\d{10,11}$/;

const CadastroCliente: React.FC = () => {
    const [cliente, setCliente] = useState<ClienteForm>({ nome: '', email: '', telefone: '', coordenada_x: 0, coordenada_y: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const validarFormulario = () => {
        if (!cliente.nome.trim()) {
            toast.error('O nome é obrigatório.', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                rtl: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                theme: "dark",

            });
            return false;
        }
        if (!emailRegex.test(cliente.email)) {
            toast.error('Por favor, insira um e-mail válido.', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                rtl: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                theme: "dark",

            });
            return false;
        }
        if (!telefoneRegex.test(cliente.telefone)) {
            toast.error('Por favor, insira um telefone válido com 10 ou 11 dígitos.', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                rtl: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                theme: "dark",

            });
            return false;
        }
        if (isNaN(cliente.coordenada_x) || isNaN(cliente.coordenada_y)) {
            toast.error('As coordenadas devem ser numéricas.', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                rtl: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                theme: "dark",

            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        try {
            await api.post('/clientes', cliente);
            toast.success('Cliente cadastrado com sucesso!', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                rtl: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                theme: "dark",

            });
            setCliente({ nome: '', email: '', telefone: '', coordenada_x: 0, coordenada_y: 0 });
        } catch (error: any) {
            const errorMsg = error.response?.data?.mensagem || 'Erro ao cadastrar o cliente.';
            toast.error(errorMsg, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                rtl: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                theme: "dark",

            });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <ToastContainer />
            <Typography component="h1" variant="h5">
                Cadastro de Cliente
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Nome"
                    name="nome"
                    autoFocus
                    value={cliente.nome}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    value={cliente.email}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Telefone"
                    name="telefone"
                    value={cliente.telefone}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Coordenada X"
                    name="coordenada_x"
                    type="number"
                    value={cliente.coordenada_x.toString()}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Coordenada Y"
                    name="coordenada_y"
                    type="number"
                    value={cliente.coordenada_y.toString()}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Cadastrar
                </Button>
            </form>
        </Container>
    );
};

export default CadastroCliente;
