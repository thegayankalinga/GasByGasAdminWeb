import React from 'react';
import Select from 'react-select';
import { SystemUserType, getSystemUserType } from "./../../utils/SystemUserType";

const cityOptions = Object.entries(SystemUserType).map(([key, value]) => ({
    value: parseInt(key),
    label: value,
  }));

const UserTypeSelect = ({name, onUserTypeSelect }) => { 
  const handleChange = (selectedOption) => {
    onUserTypeSelect(selectedOption); 
  };

  return (
    <div>
      <Select 
        options={cityOptions} 
        onChange={handleChange} 
        placeholder="Select User Type"
        name={name}  
      /> 
    </div>
  );
};

export default UserTypeSelect;