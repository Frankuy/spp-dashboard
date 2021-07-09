import React from 'react'
import * as d3 from 'd3';

function Slider(props) {
    const { margin, width, data, onChange } = props;

    const [minLoc, setMinLoc] = React.useState(200);
    const [maxLoc, setMaxLoc] = React.useState(width - 200);

    var x = d3.scaleLinear().domain(d3.extent(data, d => d.Capacity)).range([200, width - 200]).clamp(true)
    var radius = d3.scaleSqrt().domain(d3.extent(data, d => d.Capacity)).range([8, 16]).clamp(true)

    React.useEffect(() => {
        var labelTick = d3.select('.label-tick').selectAll('text').data(x.ticks(10));
        var g = labelTick.enter()
            .append('g')
            .attr('transform', d => `translate(${x(d)}, 0)`)
        g.append('text')
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', 12)
            .text(d => d)
        g.append('line')
            .attr('y1', -10)
            .attr('y2', -16)
            .attr('stroke', 'white')
        labelTick.exit().remove();

        // var labelTick = d3.select('.label-tick')
        // labelTick.call(d3.axisBottom(x));

        var minHandler = d3.select('.min');
        var minText = minHandler.select('text');
        minHandler.on("mouseover", () => {
            minText.attr('opacity', 1)
        }).on("mouseout", () => {
            minText.attr('opacity', 0)
        })
        minHandler.call(d3.drag()
            .on("drag", event => {
                var loc = event.x
                if (loc < maxLoc && loc > 200 - 5) {
                    minText.attr('opacity', 1)
                    setMinLoc(loc)
                    onChange(x.invert(loc), x.invert(maxLoc))
                }
            })
            .on("end", () => {
                minText.attr('opacity', 0)
            }))

        var maxHandler = d3.select('.max');
        var maxText = maxHandler.select('text');
        maxHandler.on("mouseover", () => {
            maxText.attr('opacity', 1)
        }).on("mouseout", () => {
            maxText.attr('opacity', 0)
        })
        maxHandler.call(d3.drag()
            .on("drag", event => {
                var loc = event.x
                if (loc > minLoc && loc < width - 200 + 5) {
                    maxText.attr('opacity', 1)
                    setMaxLoc(loc)
                    onChange(x.invert(minLoc), x.invert(loc))
                }
            })
            .on("end", () => {
                maxText.attr('opacity', 0)
            }))
    }, [maxLoc, minLoc, x, width, onChange])

    if (data.length === 0) {
        return <g></g>
    }

    return (
        <g className='slider' transform={`translate(${margin.left}, ${margin.top})`}>
            <g className='label' transform={`translate(0, 30)`}>
                <text x={width / 2} fill={'white'} textAnchor={'middle'} fontSize={12}>Capacity (MW)</text>
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
            <g className='label-tick' transform={`translate(0, 100)`}></g>
        </g>
    )
}

export default Slider
