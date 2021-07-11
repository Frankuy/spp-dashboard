import React from 'react'
import '../Styles/Tooltip.css';

function Tooltip(props) {
    const { width, height, children } = props;

    return (
        <foreignObject className="tooltip" width={width} height={height}>
          <div className="tooltip-container">
            {children}
          </div>
        </foreignObject>
        // <g className="tooltip">
        //   <rect width={width} height={height} fill="black" />
        //   <text x={width / 2} y={height / 2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12">{text}</text>
        // </g>
    )
}

export default Tooltip
