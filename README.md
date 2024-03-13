
# Guia de Inicialização do Projeto

Este guia fornece instruções detalhadas sobre como iniciar as aplicações de back-end e front-end, localmente e usando Docker, incluindo a configuração necessária para o PostgreSQL e variáveis de ambiente.

## Índice

- [Pré-Requisitos](#pré-requisitos)
- [Configuração Inicial](#configuração-inicial)
  - [Clonando o Projeto](#clonando-o-projeto)
  - [Configurando o Ambiente](#configurando-o-ambiente)
- [Iniciando Sem Docker](#iniciando-sem-docker)
  - [Back-End](#back-end)
  - [Front-End](#front-end)
- [Iniciando Com Docker](#iniciando-com-docker)
  - [Instalação do Docker](#instalação-do-docker)
  - [Iniciando as Aplicações](#iniciando-as-aplicações)
- [Acessando as Aplicações](#acessando-as-aplicações)

## Pré-Requisitos

- **Node.js**: Essencial para executar o back-end e o front-end. Baixe o Node.js em [nodejs.org](https://nodejs.org/).
- **PostgreSQL**: Necessário para o banco de dados do back-end. Instale o PostgreSQL em [postgresql.org](https://www.postgresql.org/download/).
- **Docker** (opcional): Para rodar as aplicações em containers. As instruções de instalação são fornecidas abaixo.

## Configuração Inicial

### Clonando o Projeto

1. Abra um terminal e clone o repositório:
   ```bash
   git clone https://github.com/4NTx/desafioFacilita.git
   ```
2. Navegue até o diretório do projeto usando `cd`:
   ```bash
   cd aplicacoes
   ```

### Configurando o Ambiente

- **PostgreSQL**: Após a instalação, crie um banco de dados para o projeto.
- **Arquivos `.env`**: Atualize os arquivos `.env` nas pastas do back-end e front-end com as configurações adequadas, incluindo a URL do back-end no front-end, se necessário.

## Iniciando Sem Docker

### Back-End

Navegue até `back-end`, instale as dependências com `npm install` e inicie a aplicação com `npm start`. O servidor estará rodando na porta configurada (padrão `3000`).

### Front-End

Navegue até `front-end`, repita o processo de instalação de dependências e início da aplicação. O front-end estará acessível na porta configurada (padrão `3001`).

## Iniciando Com Docker

### Instalação do Docker

- **Windows e Mac**: Baixe o Docker Desktop de [docker.com](https://www.docker.com/products/docker-desktop).
- **Linux**: Siga as instruções de instalação do Docker Engine em [docs.docker.com](https://docs.docker.com/engine/install/).

### Iniciando as Aplicações

Na raiz do projeto, execute `docker-compose up --build` para construir e iniciar os containers. Para interromper, use `docker-compose down`.

## Acessando as Aplicações

Após a inicialização, acesse o back-end pela porta configurada (padrão `3000`) e o front-end em `http://localhost:3001` no navegador.

---