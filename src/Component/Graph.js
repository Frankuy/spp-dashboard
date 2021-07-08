import { axisBottom, axisLeft, curveBasis, easeLinear, extent, line, max, scaleLinear, scaleTime, select, timeParse, timeSecond } from 'd3';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import '../Styles/Graph.css';

function Graph(props) {
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 975 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    const [data, setData] = useState([]);

    const svgRef = useRef();

    const drawGraph = useCallback(
        () => {
            // console.log(data.length)
            if (data.length) {
                const svg = select(svgRef.current)
                    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom]);

                svg.selectAll("*").remove();

                const container = svg
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Add X axis
                var x = scaleTime()
                    .domain(extent(data.slice(0, 10), d => d.timestamp))
                    .range([0, width]);

                container.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(axisBottom(x).ticks(timeSecond.every(1)));

                // Add Y axis
                var y = scaleLinear()
                    .domain([0, max(data.slice(0, 10), d => +d.dc_power)])
                    .range([height, 0]);

                container.append("g")
                    .attr("class", "axis")
                    .call(axisLeft(y));

                // Add the line
                container.append("path")
                    .datum(data.slice(0, 10))
                    .attr("fill", "none")
                    .attr("stroke", "red")
                    .attr("stroke-width", 1.5)
                    .attr("d", line().curve(curveBasis).x(d => x(d.timestamp)).y(d => y(+d.dc_power)))
                    .transition()
                    .duration(300)
                    .ease(easeLinear)
            }
        },
        [width, height, data],
    )

    const fetchData = () => {
        var new_data = {
            timestamp: timeParse("%d-%m-%Y %H:%M:%S")(moment(new Date()).format("DD-MM-YYYY HH:mm:ss")),
            dc_power: Math.random() * 10,
            ac_power: Math.random() * 10,
        }

        setData(old_data => [new_data, ...old_data]);
    }

    useEffect(() => {
        // let id = setInterval(() => {
        //     fetchData();
        // }, 1000);
        // return () => clearInterval(id);
    }, [])

    useEffect(() => {
        drawGraph()
    }, [drawGraph])

    return (
        <div className="App_graph">
            <svg
                ref={svgRef}
            >
            </svg>
        </div>
    )
}

export default Graph
