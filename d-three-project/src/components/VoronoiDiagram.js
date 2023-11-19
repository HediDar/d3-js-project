import React, { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import "../App.css";

const VoronoiDiagram = () => {
  const mySVGRef = useRef(null);
  const width = 800;
  const height = 500;
  const data = [
    [100, 100],
    [200, 200],
    [300, 150],
    [70, 80],
    [160, 90],
    [400, 33],
    [340, 210],
    [115, 50],
    [600, 300],
    // [800, 300],
  ];
  useEffect(() => {
    // Create a Voronoi generator
    const voronoi = d3.Delaunay.from(data).voronoi([1, 1, width + 100, height]);

    // Get the extent of the data points
    // const extent = d3.extent(data, (d) => d[0]);
    const svg = d3.select(mySVGRef.current);
    // svg.html(null);
    svg.attr("width", width).attr("height", height);
    const xScale = d3
      .scaleLinear() // scale is used for linear
      .domain([0, d3.max(data, (d) => d[0])])
      .range([0, width]);

    const yScale = d3
      .scaleLinear() // scale is used for linear
      .domain([0, d3.max(data, (d) => d[1])])
      .range([height , 0]);
    // Draw the Voronoi cells
    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", (d, i) => voronoi.renderCell(i))
      .attr("fill", "none")
      .attr("stroke", "black");

    // Draw the data points
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[0]))
      //same must be done for the y scale
      .attr("cy", (d) => d[1])
      .attr("r", 3)
      .attr("fill", "red");
    //draw the x and y axis

    var x_axis = d3
      .axisBottom() //axis bottom positions the numbers of the axis below the axis, so we need a y translation so that the axis are really in the botom
      .scale(xScale);
    svg
      .append("g") // add a group element that will contain our axis The <g> element is a container that groups multiple SVG elements together
      .attr("transform", "translate(0, " + height + ")")
      .call(x_axis);

    var y_axis = d3
      .axisLeft() //axis bottom positions the numbers of the axis below the axis, so we need a y translation so that the axis are really in the botom
      .scale(yScale);
    svg
      .append("g") // add a group element that will contain our axis The <g> element is a container that groups multiple SVG elements together
      // .attr("transform", "translate(50, " + 0 + ")")
      .call(y_axis);
  }, []);

  return (
    <svg
      ref={mySVGRef}
      style={{ marginLeft: "100px", marginBottom: "50px" }}
    ></svg>
  );
};

export default VoronoiDiagram;
