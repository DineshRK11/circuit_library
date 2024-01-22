import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import useStore from "../store/store";



const selector = (state) => ({
    template:state.template,
  addTemplate:state.addTemplate,
  fetchAPI:state.fetchAPI,
});



const AddTemplate = ({ open,handleClose, savedTemplate,setNodes,setEdges }) => {

  const [templateName, setTemplateName] = useState("");
  const { template, addTemplate, fetchAPI} = useStore(selector);


  // For adding a new Template
  const handleSubmit = (e) => {
    e.preventDefault();
    const Id = template.length;
    // console.log("nodes.length", template.length);
    const newTemplate ={
        id:`${Id + 1}`,
        name:templateName,
        template:savedTemplate,
    }
  //  console.log('newTemplate', newTemplate)
    addTemplate(newTemplate);
    setTimeout(()=>{
        fetchAPI()
    })
    handleClose()
    setNodes([])
    setEdges([])
  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Add New "}</DialogTitle>
      <DialogContent >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2,my:1 }}>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            onChange={(e) => setTemplateName(e.target.value)}
          />

        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}  disabled={!templateName}>
          Add Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTemplate;
