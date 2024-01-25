import React from "react";
import { Handle, Position } from 'reactflow';

const InputNode = ({ data, isConnectable,type}) => {
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
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
          <div>{data?.label}</div>

      </div>
    </>
  );
};

export default InputNode;
