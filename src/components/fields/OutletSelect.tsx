import React from 'react';
import Select from 'react-select';

const OutletSelect = ({ name, onOutletSelect, outlets }) => {
  const handleChange = (selectedOption) => {
    onOutletSelect(selectedOption);
  };

  const outletOptions = outlets.map((outlet) => ({
    value: outlet.id,
    label: `${outlet.outletName} - ${outlet.city}`,
  }));

  return (
    <div>
      <Select
        options={outletOptions}
        onChange={handleChange}
        placeholder="Select Outlet"
        name={name}
      />
    </div>
  );
};

export default OutletSelect;