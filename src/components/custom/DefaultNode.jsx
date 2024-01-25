import React from "react";
import { Handle, Position } from 'reactflow';

const DefaultNode = ({ data, isConnectable,type}) => {
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
          position={Position.Top}
          isConnectable={isConnectable}
        />
          <div>{data?.label}</div>
        <Handle
          classname="handle"
          type="range"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      </div>
    </>
  );
};

export default DefaultNode;
