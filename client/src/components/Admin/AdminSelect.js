import './AdminSelect.css';
import { useState } from 'react';

const AdminSelect = ({ options, selectedOption, setSelectedOption, labelKey }) => {
  const optionsArray = Object.values(options);

  const [isOpen, setIsOpen] = useState(false);

  const getOptionById = (id) => {
    return optionsArray.find((option) => option._id === id);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option._id);
    setIsOpen(false);
  };

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const renderOptions = () => {
    return optionsArray.map((option) => (
      <li
        key={option._id}
        className="custom-option"
        onClick={() => handleOptionClick(option)}
      >
        {option[labelKey]}
      </li>
    ));
  };

  const selectedOptionObject = getOptionById(selectedOption);

  return (
    <div className="AdminSelect">
      <div className="custom-select-header" onClick={toggleOptions}>
        {selectedOptionObject ? selectedOptionObject[labelKey] : ''}
      </div>
      <ul className={`custom-select-options ${isOpen ? 'open' : ''}`}>
        {renderOptions()}
      </ul>
    </div>
  );
};

export default AdminSelect;