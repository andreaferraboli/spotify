import React from "react";
import { styled, alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import SearchIcon from "@mui/icons-material/Search";
import "../style/navbar.css";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));


export default function PrimarySearchAppBar(props) {
  let profile = props.user??{};

  const profileLink = profile.profile_name ? "/myAccount" : "/login";
  const profile_name = profile.profile_name ?? "guest";
  const image = profile.image ?? "https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png";
  return (
    <>
      <AppBar position="static">
        <div className="myAppBar">
          <Toolbar>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={(event) => props.setQuery(event.target.value)} // Aggiungi questa riga
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box >
              <Link  to={profileLink}  style={{ textDecoration: 'none' }}>
                <Chip
                  avatar={<Avatar alt={profile_name} src={image} />}
                  label={profile_name}
                  variant="outlined"
                  className="customLabel"
                />
              </Link>
            </Box>

          </Toolbar>
        </div>
      </AppBar>
    </>
  );
}
