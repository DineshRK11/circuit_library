import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  getRectOfNodes,
  getTransformForBounds,
  MarkerType,
} from "reactflow";
import { toPng } from "html-to-image";
import useStore from "../store/store";
import { shallow } from "zustand/shallow";
import "reactflow/dist/style.css";
import AddTemplate from "./AddTemplate";
import { v4 as uid } from "uuid";
import CustomNode from "./custom/customNode";
import DefaultNode from "./custom/DefaultNode";
import InputNode from "./custom/InputNode";
import OutputNode from "./custom/OutputNode";
import CircularNode from "./custom/CircularNode";
import DiagonalNode from "./custom/DiagonalNode ";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  dragAdd: state.dragAdd,
  dragAddNode: state.dragAddNode,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
});

//Edge line styling
const connectionLineStyle = { stroke: "black" };
const edgeOptions = {
  type: "smoothstep",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "black",
  },
  // markerStart: {
  //   type: MarkerType.ArrowClosed,
  //   width: 20,
  //   height: 20,
  //   color: "#FF0072",
  // },
  animated: false,
  style: {
    stroke: "gray",
  },
};

const nodetypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode,
  receiver: CustomNode,
  signal: CustomNode,
  transmitter: CircularNode,
  transceiver: DiagonalNode,
};

const flowKey = "example-flow";

export default function Mainpage() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    dragAdd,
    dragAddNode,
    setNodes,
    setEdges,
  } = useStore(selector, shallow);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [savedTemplate, setSavedTemplate] = useState({});

  // const { setViewport } = useReactFlow();

  //Id creating fn

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

  useEffect(() => {
    setNodes([]);
    setEdges([]);
  }, []);

  //fn for Drag and drop
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const file = event.dataTransfer.getData("application/parseFile");
      const template = event.dataTransfer.getData("application/template");
      let parsedNode;
      let parsedTemplate;
      if (file) {
        parsedNode = JSON.parse(file);
      } else {
        parsedTemplate = JSON.parse(template);
      }

      // if (typeof parsedNode === "undefined" || !parsedNode || typeof parsedTemplate === "undefined" || !parsedTemplate) {
      //   return;
      // }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      if (parsedNode) {
        const newNode = {
          id: uid(),
          type: parsedNode.type,
          position,
          properties: parsedNode.properties,
          data: {
            label: parsedNode.data["label"],
            bgColor: parsedNode.data["bgColor"],
          },
        };
        dragAdd(newNode);
      }

      if (parsedTemplate) {
        let newNodes = [];
        let newEdges = [];
        const randomId = Math.floor(Math.random() * 1000);
        const randomPos = Math.floor(Math.random() * 500);

        parsedTemplate["nodes"].map((node, i) => {
          newNodes.push({
            id: `${node.id + randomId}`,
            data: node.data,
            type: node.type,
            position: {
              x: node["position"]["x"] + randomPos,
              y: node["position"]["y"] + randomPos,
            },
            properties: node.properties,
          });
        });

        parsedTemplate["edges"].map((edge, i) =>
          newEdges.push({
            id: uid(),
            source: `${edge.source + randomId}`,
            target: `${edge.target + randomId}`,
            ...edgeOptions,
          })
        );

        dragAddNode(newNodes, newEdges);
      }
    },
    [reactFlowInstance]
  );

  // console.log("nodes",nodes);
  // console.log('edges', edges);
  //fn for save & restore
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      if (flow) {
        setSavedTemplate(flow);
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    };
    restoreFlow();
  }, [reactFlowInstance]);

  const handleSave = () => {
    setOpenTemplate(true);
    onSave();
    onRestore();
  };

  const handleClose = () => {
    setOpenTemplate(false);
  };

  return (
    <Box
      sx={{
        width: {
          lg: `74vw`,
          md: "65vw",
          sm: "48vw",
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
            nodeTypes={nodetypes}
            connectionLineStyle={connectionLineStyle}
            defaultEdgeOptions={edgeOptions}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            style={{
              " .react-flow__node": {
                backgroundColor: "black",
              },
            }}
          >
            <Panel
              position="top-left"
              style={{
                display: "flex",
                gap: 5,
                background: "white",
                marginLeft: "2rem",
                marginTop: "2rem",
              }}
            >
              <Button variant="outlined" onClick={onSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={onRestore}>
                Restore
              </Button>
              <Button variant="outlined" onClick={handleSave}>
                Add
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
      <AddTemplate
        open={openTemplate}
        handleClose={handleClose}
        savedTemplate={savedTemplate}
        setNodes={setNodes}
        setEdges={setEdges}
      />
    </Box>
  );
}
