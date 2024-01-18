
import {createWithEqualityFn} from "zustand/traditional"
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

import axios from "axios";

const useStore = createWithEqualityFn((set, get) => ({
  nodes:[],
  edges: [],
  sidebarNodes:[],
  template:[],
  selectedTemplate:{},
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  fetchAPI: async () => {
    const res = await axios.get(`http://localhost:4000/template`);
    set({
      template:res.data
    })
  },

  setNodes:(newNodes)=>{
   set({
    nodes:newNodes
   })
  },
  setEdges:(newEdges)=>{
set({
  edges:newEdges
})
  },

  getSidebarNode:async()=>{
    const res = await axios.get(`http://localhost:4000/sidebarNode`);
    set({
     sidebarNodes:res.data,
    })
  },

  getTemplate:async(id)=>{
    const res = await axios.get(`http://localhost:4000/template?id=${id}`);
    set({
      selectedTemplate:res.data[0],
      nodes:res['data'][0]['template']['nodes'],
      edges:res['data'][0]['template']['edges']
    })
  } ,

  updateTemplate:async(newTemplate)=>{
    const res = await axios.patch(`http://localhost:4000/template/${newTemplate.id}`,newTemplate)
  },
  
  addTemplate:async(newTemplate)=>{
    const res = await axios.post(`http://localhost:4000/template`,newTemplate)
  },

  dragAdd:(newNode)=>{
   set(state=>({
    nodes:[
      ...state.nodes,
      newNode
    ]
   }))
  },

  addNewNode:async(newNode)=>{
    // set(state=>({
    //   sidebarNodes:[
    //     ...state.sidebarNodes,
    //     newNode
    //   ]
    //  }))
    const res = await axios.post(`http://localhost:4000/sidebarNode`,newNode);
    // set({
    //  sidebarNodes:res.data,
    // })
  },

//   addNode: (dataNode,dataEdge) =>{
//   set((state) => ({
//     nodes: [
//           ...state.nodes,
//           dataNode,
//       ],
//       edges:[
//         ...state.edges,
//         dataEdge,

//       ]
//   }))

// },
}));

export default useStore;