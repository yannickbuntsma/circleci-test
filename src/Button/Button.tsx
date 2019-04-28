import * as React from 'react'

interface Props {
  text: string
  onClick: () => void
  disabled: boolean
}

const Button: React.FC<Props> = ({ text, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}>
    {text}
  </button>
)

export default Button
