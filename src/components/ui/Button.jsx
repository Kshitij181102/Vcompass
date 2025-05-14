import React from 'react'
import './Button.css'
const Button = ({onClick,type,children}) => {
  return (
<button className="ui_button text-black border-2 "onClick={onClick} type={type} >
{children}
</button>
  )
}

export default Button