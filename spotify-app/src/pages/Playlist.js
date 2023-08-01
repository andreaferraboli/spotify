import React from 'react';

const Playlist = ({ playlistId, onBack }) => {
  // Qui implementi il codice per visualizzare la pagina della playlist utilizzando l'id ricevuto

  return (
    <>
      {/* Mostra la pagina della playlist */}
      <h1>Playlist {playlistId}</h1>
      {/* ... Aggiungi altre informazioni sulla playlist ... */}

      {/* Pulsante per tornare alla pagina Home */}
      <button onClick={onBack}>Torna alla Home</button>
    </>
  );
};

export default Playlist;