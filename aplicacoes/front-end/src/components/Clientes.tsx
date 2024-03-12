import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarClientes, calcularRota } from '../services/api';
import { ICliente, IClienteQuery } from '../interfaces/ICliente';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [filtro, setFiltro] = useState<IClienteQuery>({});
  const [pagina, setPagina] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotaClientes, setRotaClientes] = useState<ICliente[]>([]);
  const limite = 10;
  const history = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      const response = await listarClientes({ ...filtro, pagina, limite });
      setClientes(response.data.dados);
      setTotalPaginas(response.data.totalPaginas);
    };

    fetchClientes();
  }, [filtro, pagina]);

  const handleAbrirModal = async () => {
    try {
      const response = await calcularRota();
      if (Array.isArray(response.data.rota)) {
        setRotaClientes(response.data.rota);
      } else {
        console.log('A resposta não é um array:', response.data);
        setRotaClientes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar a rota dos clientes", error);
      setRotaClientes([]);
    }
    setIsModalOpen(true);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Clientes
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => history('/cadastrar-cliente')} style={{ marginRight: '10px' }}>
          Cadastrar Cliente
        </Button>
        <Button variant="contained" color="secondary" onClick={handleAbrirModal}>
          Ver Rota de Visitação
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Filtrar por nome" variant="outlined" value={filtro.nome || ''} onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Filtrar por email" variant="outlined" value={filtro.email || ''} onChange={(e) => setFiltro({ ...filtro, email: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Filtrar por telefone" variant="outlined" value={filtro.telefone || ''} onChange={(e) => setFiltro({ ...filtro, telefone: e.target.value })} />
          </Grid>
        </Grid>
      </Box>
      <Paper sx={{ mb: 2, p: 2 }}>
        <List>
          {clientes.map((cliente) => (
            <ListItem key={cliente.id} divider>
              <ListItemText primary={`${cliente.nome}`} secondary={`Email: ${cliente.email} - Telefone: ${cliente.telefone}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {pagina > 1 && (
          <Button startIcon={<ArrowBackIosNewIcon />} onClick={() => setPagina(pagina - 1)}>
            Anterior
          </Button>
        )}
        <Button endIcon={<ArrowForwardIosIcon />} onClick={() => setPagina(pagina + 1)} disabled={pagina >= totalPaginas}>
          Próxima
        </Button>
      </Box>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Ordem de Visitação dos Clientes</DialogTitle>
        <DialogContent>
          <List>
            {rotaClientes.map((cliente, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${cliente.nome}`} secondary={`Coordenadas: (${cliente.coordenada_x}, ${cliente.coordenada_y})`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Clientes;
