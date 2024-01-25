import React from "react";
import { Handle, Position } from 'reactflow';

const DiagonalNode = ({ data, isConnectable,type}) => {
  return (
    <>
      <div
        className={`diagonal-node ${type}`}
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
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          />
      </div>
    </>
  );
};

export default DiagonalNode;
