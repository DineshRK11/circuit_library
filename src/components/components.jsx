import React, { useEffect, useState } from "react";
import "./index.css";
import { Button, Drawer, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import useStore from "../store/store";
import AddIcon from "@mui/icons-material/Add";
import AddComponentNew from "./AddComponentNew";
import RemoveIcon from "@mui/icons-material/Remove";

const drawerWidth = 180;

const selector = (state) => ({
  sidebarNodes: state.sidebarNodes,
  getSidebarNode: state.getSidebarNode,
  deleteNode: state.deleteNode,
});

const Components = () => {
  const [open, setOpen] = useState(false);
  const { sidebarNodes, getSidebarNode, deleteNode } = useStore(selector);
  useEffect(() => {
    getSidebarNode();
  }, []);

  //open & closing fn for Dialog
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    deleteNode(id);
    setTimeout(() => {
      getSidebarNode();
    }, 100);
  };

  //To drag a element the data can be retrieved by using the setData's key
  const onDragStart = (event, item) => {
    const parseFile = JSON.stringify(item);
    event.dataTransfer.setData("application/parseFile", parseFile);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="sidebar"
      >
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              height: "-webkit-fill-available",
              display: "flex",
              // flexWrap:'wrap',
              position: "fixed",
              right: 0,
              top: "4rem",
              // pt: 1,
              border: "none",
              overflowY: "auto",
              ml: `${drawerWidth}px`,
              px: 3,
            },
          }}
          open
        >
          <div
            style={{
              margin: "5px",
              fontSize: "20px",
              textShadow: "1px 1px",
            }}
          >
            Nodes
          </div>
          {sidebarNodes.map((item, i) => (
            <div
              key={i}
              className={`dndnode ${item.type}`}
              style={{
                border: `0.5px solid ${item?.data?.bgColor}`,
                boxShadow: `0px 0px 5px ${item?.data?.bgColor}`,
              }}
              onDragStart={(event) => onDragStart(event, item)}
              draggable
            >
              {item.data["label"]}
              <span onClick={() => handleDelete(item.id)}>
                <RemoveIcon
                  sx={{
                    fontSize: 16,
                    ml: 1,
                    cursor: "pointer",
                    background: "#aeaeae",
                    borderRadius: 10,
                    color: "white",
                    display: "grid",
                  }}
                />
              </span>
            </div>
          ))}
          <IconButton
            aria-label="add"
            color="primary"
            onClick={handleOpen}
            sx={{
              width: "fit-content",
              height: "fit-content",
              border: "2px solid",
              p: "4px",
            }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Drawer>
      </Box>
      <AddComponentNew
        open={open}
        handleClose={handleClose}
        getSidebarNode={getSidebarNode}
      />
    </Box>
  );
};

export default Components;
