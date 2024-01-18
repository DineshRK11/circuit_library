import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import useStore from "../store/store";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

const names = [
  "Confidentiality",
  "Integrity",
  "Authenticity",
  "Authorization",
  "Non-repudiation",
  "Availability",
];

const selector = (state) => ({
  nodeState: state.sidebarNodes,
  addNode: state.addNewNode,
});

function getStyles(name, nodes, theme) {
  return {
    fontWeight:
      nodes.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const AddComponentNew = ({ open, handleClose, getSidebarNode }) => {
  const theme = useTheme();
  const [newNode, setNewNode] = useState({
    nodeName: "",
    type: "",
    properties: [],
  });
  const { addNode, nodeState } = useStore(selector);

//Name & type for the new Node
  const handleChangeName = (event) => {
    setNewNode({
      ...newNode,
      nodeName: event.target.value,
    });
  };

  const handleChangeType = (event) => {
    setNewNode({
      ...newNode,
      type: event.target.value,
    });
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNode({
      ...newNode,
      properties: typeof value === "string" ? value.split(",") : value,
    });
  };

// For Adding new Node
  const handleSubmit = (e) => {
    e.preventDefault();
    const Id = nodeState.length;
    const dataNode = {
      id: `${Id + 1}`,
      data: { label: newNode.nodeName },
      type: newNode.type,
      properties: newNode.properties,
    };

    addNode(dataNode);
    setTimeout(() => {
      getSidebarNode();
    }, []);

    handleClose();
    setNewNode({
      nodeName: "",
      type: "",
      properties: [],
    });
  };


  const CloseModel = () => {
    handleClose();
    setNewNode({
      nodeName: "",
      type: "",
      properties: [],
    });
  };
  return (
    <Dialog
      open={open}
      onClose={CloseModel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Add New "}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 1 }}>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            onChange={handleChangeName}
          />
          <FormControl sx={{ width: 350 }}>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newNode.type}
              label="type"
              onChange={handleChangeType}
            >
              <MenuItem value="input">Input</MenuItem>
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="output">Output</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: 350 }}>
            <InputLabel notched id="demo-multiple-chip-label">
              Properties
            </InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={newNode.properties}
              onChange={handleChange}
              input={
                <OutlinedInput id="select-multiple-chip" label="Properties" />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, newNode.properties, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={CloseModel} variant="outlined" color="warning">
          cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !newNode.nodeName || !newNode.type || !newNode.properties.length > 0
          }
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddComponentNew;
