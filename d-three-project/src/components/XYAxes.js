import React, { useEffect, useRef } from "react";
import { select, axisBottom, scaleLinear, axisRight } from "d3";

const XYAxes = () => {
  const lineRef = useRef(null);
  useEffect(() => {
    const svg = select(lineRef.current);

    const xScale = scaleLinear()
      .domain([0, 6]) //domain is how many data points, and in our case its 7
      .range([0, 300]); // nfar9ou el data domain min range yibda b 0 wyoufa b 300

    const yScale = scaleLinear().domain([0, 150]).range([150, 0]);

    const xAxis = axisBottom(xScale).ticks(7); //how many numbers displayed on the axis
    const yAxis = axisRight(yScale);

    svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);
    svg.select(".y-axis").style("transform", "translatex(300px)").call(yAxis);
  }, []);

  return (
    <svg ref={lineRef} style={{ background: "#eee" }}>
      <g className="x-axis"></g>
      <g className="y-axis"></g>
    </svg>
  );
};

export default XYAxes;
