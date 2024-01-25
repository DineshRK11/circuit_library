import React from "react";
import { Handle, Position } from 'reactflow';

const OutputNode = ({ data, isConnectable,type}) => {
  return (
    <>
      <div
        className={`my-custom-node ${type}`}
        style={{ 
          backgroundColor:`${data['bgColor']}`
          }}
      >
          <div>{data?.label}</div>
        <Handle
          classname="handle"
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
      </div>
    </>
  );
};

export default OutputNode;
