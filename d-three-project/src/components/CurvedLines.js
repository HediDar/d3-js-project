import React, { useEffect, useRef } from "react";
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  scaleLinear,
  axisRight,
} from "d3";

const CurvedLines = () => {
  const lineRef = useRef(null);
  const data = [25, 30, 45, 60, 20, 65, 75];
  useEffect(() => {
    const svg = select(lineRef.current);

    const xScale = scaleLinear()
      .domain([0, data.length - 1]) //domain is how many data points, and in our case its 7
      .range([0, 300]); // nfar9ou el data domain min range yibda b 0 wyoufa b 300

    const yScale = scaleLinear().domain([0, 150]).range([150, 0]);

    const xAxis = axisBottom(xScale).ticks(7);//how many numbers displayed on the axis
    const yAxis = axisRight(yScale);

    svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);
    svg.select(".y-axis").style("transform", "translatex(300px)").call(yAxis);

    // const myLine = line()
    //   .x((value, index) => index * 50) //index*50 pixels
    //   .y((value, index) => 150 - value)
    //   .curve(curveCardinal); //150 witdth - value

    const myLine = line()
      .x((value, index) => xScale(index)) //index*50 pixels
      .y(yScale)
      .curve(curveCardinal); //150 witdth - value

    // svg
    //   .selectAll("path")
    //   .data([data])
    //   .join("path")
    //   .attr("d", (value) => myLine(value))
    //   .attr("fill", "none")
    //   .attr("stroke", "blue");

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("d", (value) => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "blue");
  }, []);

  return (
    <svg ref={lineRef} style={{ background: "#eee" }}>
      <g className="x-axis"></g>
      <g className="y-axis"></g>
    </svg>
  );
};

export default CurvedLines;
