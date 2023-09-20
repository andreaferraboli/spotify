import React, {useEffect, useState} from 'react';
import {alpha, styled} from "@mui/material/styles";
import {IconButton} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {Link} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import NavigationButtons from "./NavigationButtons";
import "../styles/navbar.css";

const Search = styled("div")(({theme}) => ({
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

const SearchIconWrapper = styled("div")(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

export default function Navbar(props) {
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        // Imposta un ritardo di 500 millisecondi (0.5 secondi) prima di eseguire la query
        const delay = setTimeout(() => {
            props.setQuery(searchText);
        }, 1000);

        // Cancella il timer precedente se l'utente continua a scrivere
        return () => clearTimeout(delay);
    }, [searchText, props]);

    const handleInputChange = (event) => {
        setSearchText(event.target.value);
    };
    let profile = props.user ?? {};

    const profileLink = profile.profile_name ? "/myAccount" : "/login";
    const profile_name = profile.profile_name ?? "ACCEDI";
    const image =
        profile.image ??
        "https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png";

    return (
        <>
            <div className="navbar-height">
                <AppBar position="static">
                    <div className="myAppBar">
                        <Toolbar>
                            {props.isSmallScreen && (
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={props.onDrawerToggle}
                                >
                                    <MenuIcon/>
                                </IconButton>
                            )}
                            <NavigationButtons/>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "left",
                                    flexGrow: 1,
                                    justifyContent: "center", // Aggiungi questa riga
                                }}
                            >
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon/>
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{"aria-label": "search"}}
                                        onChange={handleInputChange}
                                    />
                                </Search>
                            </Box>
                            <Box>
                                <Link to={profileLink} style={{textDecoration: "none"}}>
                                    <Chip
                                        avatar={<Avatar alt={profile_name} src={image}/>}
                                        label={profile_name}
                                        variant="outlined"
                                        className="customLabel"
                                    />
                                </Link>
                            </Box>
                        </Toolbar>
                    </div>
                </AppBar>
            </div>
        </>
    );
}
