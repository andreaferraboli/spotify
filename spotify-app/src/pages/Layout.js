import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
function PersistentLayout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  // Verifica se la pagina corrente è la pagina di login o registrazione
  // Se sì, non visualizzare la sidebar e la navbar
  if (isLoginPage || isRegisterPage) {
    return <>{children}</>;
  }

  // Altrimenti, visualizza la sidebar e la navbar
  return (
    <Box className="home-box">
      <Grid container spacing={0}>
        <Grid item xs={0} md={2} lg={2}>
          <SideBar playlists={user.my_playlists} onPlaylistClick={handlePlaylistClick} />
        </Grid>
        <Grid direction="column" item xs={12} md={10} lg={10}>
          <Navbar user={user} />
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}