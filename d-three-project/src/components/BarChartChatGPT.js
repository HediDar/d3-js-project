import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChartChatGPT = () => {
  const chartRef = useRef();
  const data = [25, 30, 45, 60, 20, 65, 75, 300];

  useEffect(() => {
    // Set the dimensions

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create the chart group and apply margins
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create x and y scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, chartWidth])
      .padding(0.1); // padding creates space between the bars and the x coordinates horizontaly
    // x and y scales are used to create the x and y axis
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([chartHeight, 0]);

    // Create the bars
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(i)) // ces deux lignes lient les bar aux coordonnées correspondantes dans les axes x et y
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d));

    // Create x axis
    const xAxis = d3.axisBottom(xScale);

    chart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    // Create y axis
    const yAxis = d3.axisLeft(yScale);

    chart.append("g").attr("class", "y-axis").call(yAxis);
  }, []);

  return <div ref={chartRef}></div>;
};

export default BarChartChatGPT;
