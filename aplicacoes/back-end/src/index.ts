import express from 'express';
import { inicializarBancoDeDados } from './config/dbinicio';
import clientesRoutes from './routes/clientesRotas';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from "morgan";
import dotenv from 'dotenv';
dotenv.config();

const cors = require('cors');
const app = express();
const porta = dotenv.config().parsed?.APP_PORTA || 3000;

app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(helmet());
app.use(cors({
    origin: true,
    methods: "GET,POST",
    preflightContinue: false,
    allowedHeaders:
        "Authorization, Origin, X-Requested-With, Content-Type, Accept, Recaptcha",
    credentials: true,
}));
app.use(morgan("combined"));
app.use(clientesRoutes);

(async () => {
    await inicializarBancoDeDados();
    app.listen(porta, () => {
        console.log(`Servidor rodando na porta ${porta}`);
    });
})();
