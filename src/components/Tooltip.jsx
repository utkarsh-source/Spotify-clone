import { Tooltip as ReactTooltip } from 'react-tooltip'
import React from 'react'
import 'react-tooltip/dist/react-tooltip.css'

const Tooltip = (props) => {
  return (
      <ReactTooltip {...props}/>
  )
}

export default Tooltip