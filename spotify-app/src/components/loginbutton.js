import React from 'react';
import { useHistory } from 'react-router-dom'; // Importa il modulo useHistory per la navigazione

function LoginButton() {
  const history = useHistory();

  function handleClick() {
    history.push('/login'); // Reindirizza l'utente alla pagina di login quando il bottone viene premuto
  }

  return (
    <button onClick={handleClick}>
      Accedi
    </button>
  );
}

export default LoginButton;