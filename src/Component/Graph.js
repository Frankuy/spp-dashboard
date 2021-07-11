import * as d3 from 'd3';
import moment from 'moment';
import React from 'react';
import '../Styles/Graph.css';
import Tooltip from './Tooltip';

const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 975 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;

function Graph(props) {
    const { sensor } = props;

    const data = React.useRef([]);
    const [tooltip, setTooltip] = React.useState('');

    const drawGraph = (data) => {
        const x = d3.scaleTime()
            .domain(d3.extent(data.slice(0, 10), d => d.timestamp))
            .range([0, width])
            .clamp(true);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data.slice(0, 10), d => +d.dc_power)])
            .range([height, 0]);

        const svg = d3.select('.graph-svg');

        // Add X axis
        const xAxis = svg.select('.x-axis');
        xAxis.call(d3.axisBottom(x).ticks(d3.timeSecond.every(1)).tickFormat(d3.timeFormat("%I:%M:%S")));

        // Add Y axis
        const yAxis = svg.select('.y-axis');
        yAxis.call(d3.axisLeft(y));

        // Add data as circle
        const circles = svg.select('.data-circle').selectAll('circle').data(data.slice(0, 10));
        circles
            .join('circle')
            .attr('cx', d => x(d.timestamp))
            .attr('cy', d => y(d.dc_power))
            .attr('r', 6)
            .attr('fill', 'red')
            .on('mouseover', function (event, data) {
                setTooltip(
                    <div>
                        {moment(data.timestamp).format("DD-MM-YYYY HH:mm:ss")}<br />
                        Power Output: <b>{data.dc_power.toFixed(2)} W</b>
                    </div>
                );
                const tooltipSVG = d3.select('.graph-container').select('.tooltip');
                tooltipSVG
                    .attr('transform', `translate(${d3.pointer(event)[0] + 10}, ${d3.pointer(event)[1] + 10})`)
                    .transition()
                    .duration(300)
                    .style('opacity', 1);
            })
            .on('mouseout', function (event, data) {
                setTooltip('');
                const tooltipSVG = d3.select('.graph-container').select('.tooltip');
                tooltipSVG
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
            });

        // Add the line
        const line = svg.select('.data-line').select('path');
        line.datum(data.slice(0, 10))
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line().x(d => x(d.timestamp)).y(d => y(+d.dc_power)));
    }

    const fetchData = React.useCallback(
        () => {
            console.log(sensor);
            var new_data = {
                timestamp: d3.timeParse("%d-%m-%Y %H:%M:%S")(moment(new Date()).format("DD-MM-YYYY HH:mm:ss")),
                dc_power: Math.random() * 10,
                ac_power: Math.random() * 10,
            }

            data.current = [new_data, ...data.current];
            drawGraph(data.current);
        }, [sensor]
    )

    React.useEffect(() => {
        let id = setInterval(() => {
            fetchData();
        }, 1000);
        return () => clearInterval(id);
    }, [fetchData])

    React.useEffect(() => {
        data.current = [];
    }, [sensor])

    return (
        <div className="App_graph">
            <svg className="graph-svg" viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}>
                <g className="graph-container" transform={`translate(${margin.left}, ${margin.top})`}>
                    <g className="axis x-axis" transform={`translate(0, ${height})`} />
                    <g className="axis y-axis" />
                    <g className="data-circle" />
                    <g className="data-line">
                        <path />
                    </g>
                    <Tooltip width={200} height={48}>
                        {tooltip}
                    </Tooltip>
                </g>
            </svg>
        </div>
    )
}

export default Graph
