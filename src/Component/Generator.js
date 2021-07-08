import { useCallback, useEffect, useRef, useState } from 'react';
import { select, scaleSqrt, max, geoPath, geoMercator } from 'd3';
import '../Styles/Generator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 975 - margin.left - margin.right,
  height = 810 - margin.top - margin.bottom;

function Generator() {
  const [map, setMap] = useState();
  const [data, setData] = useState([]);

  const svgRef = useRef();

  const getMap = () => {
    fetch('india_state.geojson', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((map) => {
        setMap(map);
      });
  }

  const drawMap = useCallback(
    () => {
      if (map != null) {
        const svg = select(svgRef.current)
          .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])

        const container = svg.append("g")
          .attr("class", "container")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // container.remove();

        const projection = geoMercator().fitSize([width, height], map);

        const pathGenerator = geoPath().projection(projection);

        const radius = scaleSqrt([0, max(data, d => d.Capacity)], [0, 30]);

        // Draw India Map as Background
        var mapSvg = container.selectAll(".province").data(map.features);

        mapSvg.enter().append("path")
          .attr("class", "province")
          .attr("fill", "#6f6c7f")
          .attr("d", feature => pathGenerator(feature));

        mapSvg.exit().remove();

        // Draw Data as Circle
        var circleSvg = container.selectAll(".Circle").data(data);

        circleSvg
          .enter()
          .append("circle")
          .attr("class", "Circle")
          .attr("fill", "red")
          .attr("cx", d => projection([d.Longitude, d.Latitude])[0])
          .attr("cy", d => projection([d.Longitude, d.Latitude])[1])
          .attr("r", d => radius(d.Capacity))
          .on("click", function (d, i) {
            container.selectAll(".Circle").classed("Active", false);
            select(this).classed("Active", !select(this).classed("Active"))
          })
          .on("mouseover", function (d, i) {
            container.select('.Tooltip-' + i.Code).transition()
              .duration(300)
              .style('opacity', 1);
          })
          .on("mouseout", function (d, i) {
            container.select('.Tooltip-' + i.Code).transition()
              .duration(300)
              .style('opacity', 0);
          })

        circleSvg.exit().remove();

        // Draw Tooltip
        var tooltip = container.selectAll(".Tooltip").data(data);

        tooltip
          .enter()
          .append("text")
          .attr("class", d => "Tooltip Tooltip-" + d.Code)
          .attr('x', d => projection([d.Longitude, d.Latitude])[0])
          .attr('y', d => projection([d.Longitude, d.Latitude])[1])
          .attr('dy', d => radius(d.Capacity) + 16)
          .style("opacity", 0)
          .text(d => `${d.Name} - ${d.Capacity} MW`)
      }
    },
    [map, width, height, data],
  )

  // const drawMap = (map) => {
  //   if (map != null) {
  //     const svg = select(svgRef.current).attr("viewBox", [0, 0, width, height]);

  //     const projection = geoMercator().fitSize([width, height], map)

  //     const pathGenerator = geoPath().projection(projection)

  //     const radius = scaleSqrt([0, max(data, d => d.value)], [0, 10])

  //     svg.append('g')
  //       .selectAll(".province")
  //       .data(map.features)
  //       .enter()
  //       .append("path")
  //       .attr("class", "province")
  //       .attr("fill", "#6f6c7f")
  //       .attr("d", feature => pathGenerator(feature));

  //     svg.append("g")
  //       .selectAll("circle")
  //       .data(data)
  //       .enter()
  //       .append("circle")
  //       .attr("fill", "red")
  //       .attr("cx", d => projection(d.position)[0])
  //       .attr("cy", d => projection(d.position)[1])
  //       .attr("r", d => radius(d.value))
  //       .on("click", function () {
  //         select(this).style("fill", "orange")
  //       })
  //   }

  const fetchData = () => {
    fetch('http://localhost:5001/power-plant')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }

  useEffect(() => {
    getMap();
  }, [])

  useEffect(() => {
    let id = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(id);
  }, [])

  useEffect(() => {
    drawMap();
  }, [drawMap])

  if (map == null || data == []) {
    return (
      <div className="App_generator">
        <div className="Loading">
          <FontAwesomeIcon icon={faSpinner} spin />
          <span className="Loading-text">Please Wait...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="App_generator">
      <svg
        ref={svgRef}
      >
      </svg>
    </div>
  )
}

export default Generator
