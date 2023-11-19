import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = () => {
  const chartRef = useRef(null);
  const data = [10, 20, 30, 40, 100];

  useEffect(() => {
    // Set up the chart dimensions
    const width = 400;
    const height = 200;

    // Create the SVG element
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Define the data for the bar chart

    // Create the bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 40)
      .attr("y", (d) => height - d)
      .attr("width", 30)
      .attr("height", (d) => d)
      .attr("fill", "steelblue");
  }, []);

  return <div ref={chartRef} style={{ background: "#e333" }}></div>;
};

export default BarChart;
