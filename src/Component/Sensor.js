import * as d3 from 'd3';
import React from 'react';
import '../Styles/Sensor.css';

const margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 975 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

function Sensor(props) {
    const { generator } = props;

    const [data, setData] = React.useState([]);

    const drawSensor = React.useCallback(
        () => {
            var colorScale = d3.scaleLinear()
                .domain([0, 25, 50, 75, 100])
                .range(['#000000', '#294056', '#4682b4', '#a7bed9', '#ffffff'])

            var sensor = d3.select('.grid').selectAll('.sensor-rect').data(data);

            var NCol = Math.ceil(Math.sqrt(data.length));
            var NRow = Math.ceil(data.length / NCol);

            sensor.join('rect')
                .attr('class', 'sensor-rect')
                .attr('width', Math.floor(400 / NCol) - 10)
                .attr('height', Math.floor(height / NRow) - 10)
                .attr('fill', (d, i) => colorScale(100 * i / data.length))
                .attr('x', (d, i) => (i % NCol) * (Math.floor(400 / NCol)))
                .attr('y', (d, i) => Math.floor(i / NCol) * (Math.floor(height / NRow)))
                .on('mouseover', function (event, data) {

                })

            var linearGradient = d3.select('#linear-gradient');
            
            linearGradient.selectAll('stop')
                .data([
                    { offset: '0%', color: '#000000' },
                    { offset: '25%', color: '#294056'},
                    { offset: '50%', color: '#4682b4' },
                    { offset: '75%', color: '#a7bed9' },
                    { offset: '100%', color: '#ffffff' },
                ])
                .enter()
                .append('stop')
                .attr('offset', d => d.offset)
                .attr('stop-color', d => d.color);

            var legend = d3.select('.legend').select('rect');
            
            legend
                .style('fill', 'url(#linear-gradient)')
        }, [data],
    )

    const fetchData = React.useCallback(
        () => {
            d3.json(`http://localhost:5001/power-plant/${generator.Code}`).then((data) => {
                setData(data.Sensor)
            })
        }, [generator.Code]
    )

    React.useEffect(() => {
        fetchData();
    }, [fetchData])

    React.useEffect(() => {
        drawSensor()
    }, [drawSensor])

    return (
        <div className='App_sensor'>
            <h4 className='generator-name'>
                {generator.Name}
            </h4>
            <div className='generator-grid'>
                <svg className='grid-svg' viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}>
                    <g className='grid' transform={`translate(${width / 2 - 400 / 2}, ${height / 2 - 400 / 2})`} />
                    <g className='legend' transform={`translate(${margin.left}, ${height - margin.bottom})`}>
                        <text fill='white' fontSize='12' y={-20}>Power Output (W)</text>
                        <text fill='white' fontSize='12'>0</text>
                        <text fill='white' fontSize='12' x={180 + 16}>100</text>
                        <rect width='180' height='12' x={12} y={-10}></rect>
                    </g>
                    <defs>
                        <linearGradient id='linear-gradient' />
                    </defs>
                </svg>
            </div>
        </div>
    )
}

export default Sensor
