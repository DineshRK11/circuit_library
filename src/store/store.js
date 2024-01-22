
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
    try{
      const res = await axios.post(`http://localhost:4000/template`,newTemplate)
      console.log('res store', res)
      if(res){
        setTimeout(() => {
          alert("Added Succesfully")
          window.location.reload();
      }, 500);  
      }
    }catch(err){
      console.log('err', err)
      setTimeout(() => {
        alert("Something went Wrong")
    }, 1000);  
    }
  },

  dragAdd:(newNode)=>{
   set(state=>({
    nodes:[
      ...state.nodes,
      newNode
    ]
   }))
  },

  dragAddNode:(newNode,newEdge)=>{
    // console.log("store",newNode);
    set(state=>({
     nodes:state.nodes.concat(newNode),
     edges:state.edges.concat(newEdge)
    }))
   },
  addNewNode:async(newNode)=>{
    const res = await axios.post(`http://localhost:4000/sidebarNode`,newNode);

  },


}));

export default useStore;