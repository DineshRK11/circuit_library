import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import './index.css'
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import useStore from "../store/store";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
const drawerWidth = 180;

const selector = (state) => ({
  template: state.template,
  fetchAPI: state.fetchAPI,
  deleteTemplate: state.deleteTemplate,
});

function Sidebar() {
  const { template, fetchAPI, deleteTemplate } = useStore(selector);
  const [hovered, setHovered] = useState(-1);
  const [selected, setSelected] = useState(-1);
  const [removeId, setRemoveId] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = (text) => {
    setRemoveId(text.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleHover = (index) => {
    setHovered(index);
  };

  const handleEndHover = () => {
    setHovered(-1);
  };

  const handleDelete = () => {
    deleteTemplate(removeId);
    setTimeout(() => {
      fetchAPI();
      handleClose();
      window.location.href='/'
    }, 100);
  };

  const handleDetailsOpen = (text, index) => {
    console.log("text", text);
    navigate(`/edit/${text.id}`);
    setSelected(index);
  };

  const onDragStart = (event, item) => {
    const parseFile = JSON.stringify(item["template"]);
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
          <div
            key={index}
            className={`library ${text.name}`}
            style={{
              background:
                selected === index ? "rgba(25, 118, 210,0.15)" : "none",
            }}
            onDragStart={(event) => onDragStart(event, text)}
            onClick={() => handleDetailsOpen(text, index)}
            draggable
            onPointerEnter={() => handleHover(index)}
            onPointerLeave={handleEndHover}
          >
            {text["name"]}

              <span 
              onClick={() => handleClickOpen(text)}
              style={{
                display: hovered === index ? "inline" : "none",
                position:'relative',
                left:'20px'
              }}>

              <DeleteForeverIcon
                sx={{
                  fontSize: 16,
                  cursor: "pointer",
                }}
              />
            </span>
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">"Are you sure ?"</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this template ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sidebar;
