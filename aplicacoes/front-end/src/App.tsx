import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Clientes from './components/Clientes';
import CadastroCliente from './components/CadastroClientes';
import { Flip, ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/cadastrar-cliente" element={<CadastroCliente />} />
        </Routes>
      </Router>

      <ToastContainer
        position="bottom-center"
        limit={3}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        transition={Flip}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
    </>
  );
};

export default App;
