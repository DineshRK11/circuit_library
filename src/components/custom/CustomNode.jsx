import React from "react";
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data, isConnectable,type}) => {
  return (
    <>
      <div
        className={`my-custom-node ${type}`}
        style={{ 
          backgroundColor:`${data['bgColor']}`
          }}
      >
        <Handle
          classname="handle"
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
          <div>{data?.label}</div>
        <Handle
          classname="handle"
          type="range"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </div>
    </>
  );
};

export default CustomNode;
