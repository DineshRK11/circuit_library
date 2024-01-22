import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Button, Typography } from "@mui/material";
import useStore from "../store/store";
import { useNavigate } from "react-router-dom";

const drawerWidth = 180;

const selector = (state) => ({
  template: state.template,
  fetchAPI: state.fetchAPI,
});

function Sidebar() {

  const { template, fetchAPI } = useStore(selector);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleDetailsOpen = (text) => {
    console.log("text", text);
    navigate(`/edit/${text.id}`);
  };

  const onDragStart = (event, item) => {
    const parseFile = JSON.stringify(item['template']);
    // console.log("parseFile",parseFile)
    event.dataTransfer.setData("application/template", parseFile);
    event.dataTransfer.effectAllowed = "move";
  };

  const drawer = (
    <div>
      <List>
        <Typography sx={{ fontSize: 18, fontWeight: 700, my: 1 }}>
          Libraries
        </Typography>
        {template.map((text, index) => (
          <div key={index} 
          className={`library ${text.name}`}
          onDragStart={(event) => onDragStart(event, text)}
          onClick={() => handleDetailsOpen(text)}
          draggable
          >
        {text["name"]}
          </div>
        ))}
      </List>
      <Button
        variant="outlined"
        sx={{ mx: 1, px: 1, fontSize: 12, fontWeight: 600 }}
        onClick={() => navigate("/")}
      >
        CREATE COMPONENT
      </Button>

    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              position: "fixed",
              top: "4rem",
              border: "none",
              height: "-webkit-fill-available",
              overflowY: "auto",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default Sidebar;
