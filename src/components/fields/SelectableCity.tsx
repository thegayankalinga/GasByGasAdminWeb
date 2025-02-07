import React from 'react';
import Select from 'react-select';

const cityOptions = [
  { value: 'Colombo', label: 'Colombo' },
  { value: 'Kandy', label: 'Kandy' },
  { value: 'Galle', label: 'Galle' },
  { value: 'Jaffna', label: 'Jaffna' },
  { value: 'Negombo', label: 'Negombo' },
  { value: 'Anuradhapura', label: 'Anuradhapura' },
  { value: 'Ratnapura', label: 'Ratnapura' },
  { value: 'Badulla', label: 'Badulla' },
  { value: 'Matara', label: 'Matara' },
  { value: 'Batticaloa', label: 'Batticaloa' },
  { value: 'Trincomalee', label: 'Trincomalee' },
  { value: 'Kurunegala', label: 'Kurunegala' },
  { value: 'Nuwara Eliya', label: 'Nuwara Eliya' },
  { value: 'Polonnaruwa', label: 'Polonnaruwa' },
  { value: 'Hambantota', label: 'Hambantota' },
];

const SelectableCity = ({name, onCitySelect }) => { 
  const handleChange = (selectedOption) => {
    onCitySelect(selectedOption); 
  };

  return (
    <div>
      <Select 
        options={cityOptions} 
        onChange={handleChange} 
        placeholder="Select City"
        name={name}  
      /> 
    </div>
  );
};

export default SelectableCity;