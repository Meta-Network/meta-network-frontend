import React from 'react'

interface Props {
  readonly style?: any
}

const NodeChoose: React.FC<Props> = React.memo( function NodeChoose ({ style}) {

  // console.log('NodeChoose components')

  return (
    <g style={{ transform: 'translate(-10px, -10px)', ...style }}>
      <svg
        width="19"
        height="19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
          <path d="M9.752 1.107v16m8-8h-16" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </g>
  )
})

export default NodeChoose