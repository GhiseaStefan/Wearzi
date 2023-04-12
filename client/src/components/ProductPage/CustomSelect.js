import './CustomSelect.css'
import { useEffect, useState } from 'react'

const CustomSelect = ({ options, setSelectedResult }) => {
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedResult(selectedOption)
  }, [selectedOption])

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsOpen(false);
  }

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const renderOptions = () => {
    return options.map((option) => (
      <li
        key={option}
        className='custom-option'
        onClick={() => handleOptionClick(option)}
      >
        {option}
      </li>
    ))
  }

  return (
    <div className='CustomSelect'>
      <div className='custom-select-header' onClick={toggleOptions}>{selectedOption}</div>
      <ul className={`custom-select-options ${isOpen ? 'open' : ''}`}>
        {renderOptions()}
      </ul>
    </div>
  )
}

export default CustomSelect