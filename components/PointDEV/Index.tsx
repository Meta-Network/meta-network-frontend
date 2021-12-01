import React from 'react'

const PointDEV = React.memo( function PointDEV () {
	return (
		<>
			{
				// 辅助点
				process.env.NODE_ENV === 'development' ? <div className="point"></div> : null
			}
		</>
	)
})

export default PointDEV