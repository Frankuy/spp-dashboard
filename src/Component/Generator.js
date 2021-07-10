import React from 'react';
import * as d3 from 'd3';
import '../Styles/Generator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimes, faSun } from '@fortawesome/free-solid-svg-icons';
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
  const [generator, setGenerator] = React.useState();

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

  const drawMap = React.useCallback(
    () => {
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
    }, [map]
  )

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
            setGenerator(data);

            // Set Active Circle
            d3.selectAll(".circle").classed("active", false);
            d3.select(this).classed("active", true);

            // Zoom In / Zoom Out
            var [x, y] = projection([data.Longitude, data.Latitude])
            var mapContainer = d3.select('.map-container');
            mapContainer
              .transition()
              .duration(750)
              .attr('transform', `translate(${width / 2}, ${height / 2})scale(4)translate(${-x}, ${-y})`)
            var detail = d3.select('.generator-detail')
            detail
              .transition()
              .duration(750)
              .attr('opacity', 1)
              .attr('y', height / 2)
          })
          .on("mousemove", function (event, data) {
            if (!d3.select(this).classed("active")) {
              setTooltip(`${data.Name} - ${data.Capacity} MW`);
              var tooltipSVG = d3.select('.tooltip');
              tooltipSVG
                .attr('transform', `translate(${d3.pointer(event)[0] - 300 / 2}, ${d3.pointer(event)[1] + 40})`)
                .transition()
                .duration(300)
                .style('opacity', 1);
            }
            else {
              var tooltipSVG = d3.select('.tooltip');
              tooltipSVG.style('opacity', 0);
            }
          })
          .on("mouseout", function (event, data) {
            if (!d3.select(this).classed("active")) {
              var tooltipSVG = d3.select('.tooltip');
              tooltipSVG.transition()
                .duration(300)
                .style('opacity', 0);
            }
            else {
              var tooltipSVG = d3.select('.tooltip');
              tooltipSVG.style('opacity', 0);
            }
          })
        circleSVG.exit().remove();
      }
    }, [map, data, onClick]
  )

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
    }, [data]
  );

  const onClickClose = React.useCallback(
    () => {
      onClick(null);

      d3.selectAll(".circle").classed("active", false);

      var mapContainer = d3.select('.map-container');
      mapContainer
        .transition()
        .duration(750)
        .attr('transform', `translate(${margin.left}, ${margin.top + 160})`)
      mapContainer
        .classed("active", !mapContainer.classed("active"));

      var detail = d3.select('.generator-detail')
      detail
        .transition()
        .duration(750)
        .attr('opacity', 0)
        .attr('y', height)
        .on('end', () => setGenerator(null))
    }
  )

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
        <foreignObject opacity={0} className="generator-detail" x={width / 2 + 140} y={height} width={width / 2 - 140} height={height / 2}>
          <div className="detail-container">
            <div className="close">
              <FontAwesomeIcon icon={faTimes} color={'white'} onClick={onClickClose} />
            </div>
            <span className="font-weight-bold">{generator?.Name}</span>
            <div className="detail-table">
              <div className="row">
                <FontAwesomeIcon icon={faSun} size='5x' />
                <span className="value"><span className="number">32</span>&#176;C</span>
              </div>
              <div className="row custom-border">
                <span className="label">Code</span>
                <span className="value">{generator?.Code}</span>
              </div>
              <div className="row custom-border">
                <span className="label">Name</span>
                <span className="value">{generator?.Name}</span>
              </div>
              <div className="row custom-border">
                <span className="label">Capacity</span>
                <span className="value">{generator?.Capacity} MW</span>
              </div>
              <div className="row custom-border">
                <span className="label">Longitude</span>
                <span className="value">{generator?.Longitude}</span>
              </div>
              <div className="row custom-border">
                <span className="label">Latitude</span>
                <span className="value">{generator?.Latitude}</span>
              </div>
            </div>
          </div>
        </foreignObject>
        <Slider width={width - margin.left - margin.right} margin={margin} data={data} onChange={onChangeSlider} />
      </svg>
    </div>
  )
}

export default Generator
