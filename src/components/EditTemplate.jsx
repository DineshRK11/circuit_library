import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
  getRectOfNodes,
  getTransformForBounds,
  Panel,
  MarkerType,
} from "reactflow";
import { toPng } from "html-to-image";
import useStore from "../store/store";
import { shallow } from "zustand/shallow";
import "reactflow/dist/style.css";
import { useParams } from "react-router-dom";
import { v4 as uid } from "uuid";


//state from Store/zustand
const selector = (state) => ({
  selectedTemplate: state.selectedTemplate,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  dragAdd: state.dragAdd,
  dragAddNode:state.dragAddNode,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  getTemplate: state.getTemplate,
  updateTemplate: state.updateTemplate,
});

//Edge line styling
const connectionLineStyle = { stroke: "black" };
const edgeOptions = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#FF0072",
  },
  markerStart: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#FF0072",
  },
  animated: true,
  style: {
    stroke: "black",
  },
};

const flowKey = "example-flow";

export default function EditPage() {
  const {
    nodes,
    edges,
    selectedTemplate,
    onNodesChange,
    onEdgesChange,
    onConnect,
    dragAdd,
    dragAddNode,
    setNodes,
    setEdges,
    getTemplate,
    updateTemplate,
  } = useStore(selector, shallow);

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  //   const { getNodes } = useReactFlow();
  const { id } = useParams();

  //Id creating fn
  let Id = nodes.length;
  const getId = () => `N${Id++}`;

  useEffect(() => {
    getTemplate(id);
    setTimeout(() => {
      onSave(); // to run the fn and to save the instance of selected template
      onRestore();
    }, 100);
  }, [id, reactFlowInstance]);

  //fn for Drag and drop
  const onDragOver = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [reactFlowInstance]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const file = event.dataTransfer.getData("application/parseFile");
      const template = event.dataTransfer.getData("application/template");
      let parsedNode;
      let parsedTemplate;
      if(file){
       parsedNode = JSON.parse(file);
      }else{
       parsedTemplate = JSON.parse(template)
      }

      // if (typeof parsedNode === "undefined" || !parsedNode || typeof parsedTemplate === "undefined" || !parsedTemplate) {
      //   return;
      // }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      if(parsedNode){
      const newNode = {
        id: uid(),
        type: parsedNode.type,
        position,
        properties: parsedNode.properties,
        data: { label: parsedNode.data["label"] },
      };
      dragAdd(newNode);

      
    };

    if(parsedTemplate){
      let newNodes=[];
      let newEdges=[];
      let Id = uid();      
      parsedTemplate['nodes'].map((node,i)=>{
        newNodes.push({
          id:node.id,
          data:node.data,
          type:node.type,
          position:node.position,
          properties:node.properties,
  
      })
      })
    
      parsedTemplate['edges'].map((edge,i)=>(
        newEdges.push({
         id:`${edge.id}${i}-${i+1} `,
         source:edge.source,
         target:edge.target,
         ...edgeOptions,
    })
        ))
   
      dragAddNode(newNodes,newEdges);
    }

    },
    [reactFlowInstance]
  );



  //for downloading the circuit and image
  function downloadImage(dataUrl) {
    const a = document.createElement("a");

    a.setAttribute("download", "reactflow.png");
    a.setAttribute("href", dataUrl);
    a.click();
  }

  const imageWidth = 1024;
  const imageHeight = 768;

  const handleDownload = () => {
    const nodesBounds = getRectOfNodes(nodes);
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );

    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "#1a365d",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };


  //to save and Restore circuit diagram
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    let flow;
    const restoreFlow = async () => {
      flow = JSON.parse(localStorage.getItem(flowKey));
    };
    restoreFlow();
    const { x = 0, y = 0, zoom = 1 } = flow.viewport;

    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
  }, [reactFlowInstance]);


  //To update the circuit diagram
  const handleSave = () => {
    onSave();
    let flow;
    const restoreFlow = async () => {
      flow = JSON.parse(localStorage.getItem(flowKey));
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    };
    restoreFlow();

    const newTemplate = {
      id: selectedTemplate?.id,
      name: selectedTemplate?.name,
      template: flow,
    };
    updateTemplate(newTemplate);
    setTimeout(() => {
      alert("Updated Succesfully");
    }, 1000);
  };


  return (
    <Box
      sx={{
        width: {
          lg: `78vw`,
          md: "70vw",
          sm: "65vw",
          xs: "90vw",
        },
        height: "89vh",

        marginTop: "1rem",
      }}
    >
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionLineStyle={connectionLineStyle}
            defaultEdgeOptions={edgeOptions}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            fitViewOptions={{
              padding: 2,
            }}
          >
            <Panel
              position="top-left"
              style={{
                display: "flex",
                gap: 5,
                marginTop: "2rem",
                background: "white",
                marginLeft: "2rem",
              }}
            >
              <Button variant="outlined" onClick={onSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={onRestore}>
                Restore
              </Button>
              <Button variant="outlined" onClick={handleSave}>
                Update
              </Button>
              <Button
                variant="outlined"
                className="download-btn"
                onClick={handleDownload}
              >
                Download Image
              </Button>
            </Panel>

            <Controls />
            <MiniMap zoomable pannable />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </Box>
  );
}
