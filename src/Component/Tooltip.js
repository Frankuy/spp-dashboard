import React from 'react'

function Tooltip(props) {
    const { width, height, text } = props;

    return (
        <g className="tooltip">
          <rect width={width} height={height} fill="black" />
          <text x={width / 2} y={height / 2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="12">{text}</text>
        </g>
    )
}

export default Tooltip
