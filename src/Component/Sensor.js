import { select } from "d3";
import { useCallback, useEffect, useRef, useState } from "react";
import '../Styles/Sensor.css';

function Sensor(props) {
    const { width, height } = props;
    const NRow = 8
    const NColumn = 8

    const [data, setData] = useState([]);

    const svgRef = useRef();

    const drawSensor = useCallback(
        () => {
            const svg = select(svgRef.current).attr("viewBox", [0, 0, width, height]);

            const containers = svg.selectAll(".sensor").data(data);

            const sensors = containers
                .enter()
                .append('g')
                .attr("class", "sensor")

            sensors.append("rect")
                .attr("class", "sensor-rect")
                .attr("width", 80)
                .attr("height", 80)
                .attr("fill", d => d.Healthy === 1 ? "blue" : "red")
                .attr("x", (d, i) => (i % NColumn) * 100)
                .attr("y", (d, i) => Math.floor(i / NRow) * 100)

            sensors.append("text")
                .attr("class", "sensor-text")
                .attr("x", (d, i) => (i % NColumn) * 100)
                .attr("y", (d, i) => Math.floor(i / NRow) * 100)
                .attr("dx", 40)
                .attr("dy", 40)
                .attr("text-anchor", "middle")
                .text(d => d.Name);

            sensors.exit().remove();
        },
        [width, height, data],
    )

    const fetchData = () => {
        fetch('http://localhost:5001/power-plant/1')
            .then((response) => response.json())
            .then((data) => {
                setData(data.Sensor);
            });
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        drawSensor()
    }, [drawSensor])

    return (
        <div className="App_sensor">
            <h4>Chanraka Solar Power Plant</h4>
            <svg
                ref={svgRef}
            >
            </svg>
        </div>
    )
}

export default Sensor
