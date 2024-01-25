import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Components from "./components";

const Navbar = () => {
  return (
    <nav>
      <AppBar component="nav" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: "flex", lexGrow: 1 }}
          >
            Circuits
          </Typography>
        </Toolbar>
      </AppBar>
        <Components/>
    </nav>
  );
};

export default Navbar;
