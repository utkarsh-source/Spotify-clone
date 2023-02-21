import React from 'react'
import {Dropdown as ReactDropdown} from 'react-dropdown';
import 'react-dropdown/style.css';

const Dropdown = ({children}) => {
  return (
    <ReactDropdown>{children}</ReactDropdown>
  )
}

export default Dropdown