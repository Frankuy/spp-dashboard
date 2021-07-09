import React from 'react'
import * as d3 from 'd3';

function Slider(props) {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = 975 - margin.left - margin.right;

    const [data, setData] = React.useState([400, 644]);
    const [minLoc, setMinLoc] = React.useState(200);
    const [maxLoc, setMaxLoc] = React.useState(width - 200);

    var x = d3.scaleLinear().domain(d3.extent(data)).range([200, width - 200]).clamp(true)
    var radius = d3.scaleSqrt().domain(d3.extent(data)).range([8, 16]).clamp(true)

    React.useEffect(() => {
        var labelTick = d3.select('.label-tick').selectAll('text').data(x.ticks(10));
        labelTick.enter()
            .append('text')
            .attr('x', x)
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', 12)
            .text(d => d);
        labelTick.exit().remove();

        var minHandler = d3.select('.min');
        var minText = minHandler.select('text');
        minHandler.call(d3.drag()
            .on("drag", event => {
                var loc = event.x
                if (loc < maxLoc && loc > 200 - 5) {
                    minText.attr('opacity', 1)
                    setMinLoc(loc)
                }
            })
            .on("end", () => {
                minText.attr('opacity', 0)
            }))

        var maxHandler = d3.select('.max');
        var maxText = maxHandler.select('text');
        maxHandler.call(d3.drag()
            .on("drag", event => {
                var loc = event.x
                if (loc > minLoc && loc < width - 200 + 5) {
                    maxText.attr('opacity', 1)
                    setMaxLoc(loc)
                }
            })
            .on("end", () => {
                maxText.attr('opacity', 0)
            }))
    }, [maxLoc, minLoc, x, width])

    return (
        <g className='slider' transform={`translate(${margin.left}, ${margin.top})`}>
            <g className='label' transform={`translate(0, 30)`}>
                <text x={width / 2} fill={'white'} textAnchor={'middle'} fontSize={12}>Capacity</text>
            </g>
            <g className='track' transform={`translate(0, 80)`}>
                <line x1={x.range()[0]} x2={x.range()[1]} stroke='white' strokeWidth={2}></line>
                <line x1={minLoc} x2={maxLoc} stroke='steelblue' strokeWidth={2}></line>
                <g className='min' transform={`translate(${minLoc}, 0)`} cursor={'pointer'}>
                    <text opacity={0} y={-20} fill={'white'} textAnchor={'middle'}>{x.invert(minLoc).toFixed(2)}</text>
                    <circle r={radius(minLoc)} fill={'white'}></circle>
                </g>
                <g className='max' transform={`translate(${maxLoc}, 0)`} cursor={'pointer'}>
                    <text opacity={0} y={-20} fill={'white'} textAnchor={'middle'}>{x.invert(maxLoc).toFixed(2)}</text>
                    <circle r={radius(maxLoc)} fill={'white'}></circle>
                </g>
            </g>
            <g className='label-tick' transform={`translate(0, 110)`}></g>
        </g>
    )
}

export default Slider
