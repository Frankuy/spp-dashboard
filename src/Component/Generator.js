import React from 'react';
import * as d3 from 'd3';
import '../Styles/Generator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Slider from './Slider';
import Tooltip from './Tooltip';

const margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 975 - margin.left - margin.right,
  height = 810 - margin.top - margin.bottom;

function Generator(props) {
  const { onClick } = props;

  const [map, setMap] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [tooltip, setTooltip] = React.useState();

  const getMap = () => {
    d3.json('india_state.geojson').then((map) => {
      setMap(map);
    })
  }

  const fetchData = () => {
    d3.json('http://localhost:5001/power-plant').then((data) => {
      setData(data);
    })
  }

  const drawMap = React.useCallback(() => {
    if (map != null) {
      var projection = d3.geoMercator().fitSize([width, height - 200], map);

      var pathGenerator = d3.geoPath().projection(projection);

      // Draw India Map as Background
      var mapSVG = d3.select('.map').selectAll(".province").data(map.features);
      mapSVG.enter().append("path")
        .attr("class", "province")
        .attr("fill", "steelblue")
        .attr("d", feature => pathGenerator(feature));
      mapSVG.exit().remove();
    }
  }, [map])

  const drawData = React.useCallback(
    () => {
      if (map != null && data.length > 0) {
        var projection = d3.geoMercator().fitSize([width, height - 200], map);

        var radius = d3.scaleSqrt().domain(d3.extent(data, d => d.Capacity)).range([8, 16]).clamp(true)

        // Draw Data as Circle
        var circleSVG = d3.select(".data").selectAll(".circle").data(data);
        circleSVG
          .enter()
          .append("circle")
          .attr("class", "circle")
          .attr("cx", d => projection([d.Longitude, d.Latitude])[0])
          .attr("cy", d => projection([d.Longitude, d.Latitude])[1])
          .attr("r", d => radius(d.Capacity))
          .on("click", function (event, data) {
            onClick(data);

            // Set Active Circle
            d3.selectAll(".circle").classed("active", false);

            // Zoom In / Zoom Out
            var [x, y] = projection([data.Longitude, data.Latitude])
            var mapContainer = d3.select('.map-container');
            mapContainer
              .transition()
              .duration(750)
              .attr('transform', `translate(${margin.left}, ${margin.top + 160})`)
            mapContainer
              .classed("active", !mapContainer.classed("active"));
            if (mapContainer.classed("active")) {
              d3.select(this).classed("active", true);
              mapContainer
                .transition()
                .duration(750)
                .attr('transform', `translate(${width / 2}, ${height / 2})scale(4)translate(${-x}, ${-y})`)
            }
          })
          .on("mousemove", function (event, data) {
            setTooltip(`${data.Name} - ${data.Capacity} MW`);
            var tooltipSVG = d3.select('.tooltip');
            tooltipSVG
              .attr('transform', `translate(${d3.pointer(event)[0] - 300 / 2}, ${d3.pointer(event)[1] + 40})`)
              .transition()
              .duration(300)
              .style('opacity', 1);
          })
          .on("mouseout", function (event, data) {
            var tooltipSVG = d3.select('.tooltip');
            tooltipSVG.transition()
              .duration(300)
              .style('opacity', 0);
          })
        circleSVG.exit().remove();
      }
    }, [map, data, onClick])

  const onChangeSlider = React.useCallback(
    (min, max) => {
      var radius = d3.scaleSqrt().domain(d3.extent(data, d => d.Capacity)).range([8, 16]).clamp(true)
      var circles = d3.selectAll(".circle");
      circles
        .transition()
        .duration(100)
        .attr('r', d => {
          if (d.Capacity >= min && d.Capacity <= max) {
            return radius(d.Capacity);
          }
          return 0;
        })
    }, [data]);

  React.useEffect(() => {
    getMap();
    fetchData();
  }, [])

  React.useEffect(() => {
    drawMap();
  }, [drawMap])

  React.useEffect(() => {
    drawData();
  }, [drawData])

  if (map == null) {
    return (
      <div className="App_generator">
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} spin />
          <span className="loading-text">Please Wait...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="App_generator">
      <svg
        viewBox={`0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`}
      >
        <g className="map-container" transform={`translate(${margin.left}, ${margin.top + 160})`}>
          <g className="map" />
          <g className="data" />
          <Tooltip width={300} height={20} text={tooltip} />
        </g>
        <Slider width={width - margin.left - margin.right} margin={margin} data={data} onChange={onChangeSlider} />
      </svg>
    </div>
  )
}

export default Generator
