import React from 'react';

const ErrorItem = ({
  errorData
}) => {
  return (
    <div>
    {errorData.map((item, index) => {
      return <div key = {index}>{item.message}</div>
    })}
    </div>
  );
};
export default ErrorItem
