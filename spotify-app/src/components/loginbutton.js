import React from 'react'; // Importa il modulo useHistory per la navigazione
import { Link } from 'react-router-dom';

function LoginButton() {


  return (
      <Link to={"/Login"}>
      Accedi
      </Link>
  );
}

export default LoginButton;