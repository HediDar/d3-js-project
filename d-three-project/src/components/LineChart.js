import React, { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import "../App.css";
import csvFile from "../jdi_data_daily.csv";

const LineChart = () => {
  const mySVGRef = useRef(null);
  const margin = { top: 70, right: 30, bottom: 40, left: 80 };
  const width = 1200 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const [data, setData] = useState([
    // { date: new Date("2022-01-01"), value: 200 },
    // { date: new Date("2022-02-01"), value: 250 },
    // { date: new Date("2022-03-01"), value: 180 },
    // { date: new Date("2022-04-01"), value: 300 },
    // { date: new Date("2022-05-01"), value: 280 },
    // { date: new Date("2022-06-01"), value: 220 },
    // { date: new Date("2022-07-01"), value: 300 },
    // { date: new Date("2022-08-01"), value: 450 },
    // { date: new Date("2022-09-01"), value: 280 },
    // { date: new Date("2022-10-01"), value: 600 },
    // { date: new Date("2022-11-01"), value: 780 },
    // { date: new Date("2022-12-01"), value: 320 },
  ]);

  useEffect(() => {
    d3.csv(csvFile).then(function (data) {
      const myTransitionArray = [];
      data.forEach((element) => {
        myTransitionArray.push({
          date: new Date(element.date),
          value: +element.population,
        });
      });
      setData(myTransitionArray);
    });
  }, []);

  useEffect(() => {
    const svg = d3
      .select(mySVGRef.current)
      //.append("svg") we dont needd append svg because we are working with an svg not a div
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)
      .append("g");
    //   .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data.map((d, i) => d.date)))
      .range([0, width]);
    var x_axis = d3
      .axisBottom() //axis bottom positions the numbers of the axis below the axis, so we need a y translation so that the axis are really in the botom
      .scale(xScale)
      .tickValues(xScale.ticks(d3.timeMonth.every(4)))
      .tickFormat(d3.timeFormat("%b %Y"));

    svg
      .append("g") // add a group element that will contain our axis The <g> element is a container that groups multiple SVG elements together
      .attr("transform", `translate(${margin.left / 2},${height - 30})`)
      .call(x_axis)
      .style("font-size", "14")
      //remove the x axis
      .call((g) => g.select(".domain").remove())
      //remove the ticks
      .selectAll(".tick line")
      .style("stroke-opacity", 0);
    //change the color of the x axis text
    // svg.selectAll(".tick text").attr("fill", "#777");

    const yScale = d3
      .scaleLinear()
      .domain([60000, d3.max(data, (d) => d.value)])
      .range([height - 30, 10]);

    var y_axis = d3
      .axisLeft() //axis bottom positions the numbers of the axis below the axis, so we need a y translation so that the axis are really in the botom
      .scale(yScale)
      .tickFormat((d) => {
        return `${(d / 1000).toFixed(0)}k`;
      });
    //   .ticks((d3.max(data, (d) => d.population) - 65000) / 5000)

    svg
      .append("g") // add a group element that will contain our axis The <g> element is a container that groups multiple SVG elements together
      .attr("transform", `translate(${margin.left / 2},${0})`)
      .call(y_axis)
      .style("font-size", "14")
      //remove the y axis
      .call((g) => g.select(".domain").remove())
      //remove the ticks
      .selectAll(".tick line")
      .style("stroke-opacity", 0);

    // changes the color of the tick text for both of the x and y axis
    svg.selectAll(".tick text").attr("fill", "#777");

    // Add vertical gridlines
    svg
      .selectAll("xGrid")
      .data(xScale.ticks())
      .join("line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", 0)
      .attr("y2", height - 30)
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5);

    // Add horizontal gridlines
    svg
      .selectAll("yGrid")
      .data(yScale.ticks())
      .join("line")
      .attr("x1", (d) => 0)
      .attr("x2", (d) => width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5);
    //add a text title for the chart
    svg
      .append("text")
      .attr("x", width / 2 - 100)
      .attr("y", 0)
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")
      .text("this is the chart title");
    //add a y title
    svg
      .append("text")
      .attr("x", -height / 2 - 20)
      .attr("y", -30)
      .attr("transform", "rotate(-90)")

      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .attr("fill", "#777")
      .text("population");

    // create tooltip div

    // const tooltip = d3.select("body").append("div").attr("class", "tooltip");
    // // Add a circle element that will follow the projection of our mouse into the chart
    // const circle = svg
    //   .append("circle")
    //   .attr("r", 0)
    //   .attr("fill", "steelblue")
    //   .style("stroke", "white")
    //   .attr("opacity", 0.7)
    //   .style("pointer-events", "none");
    // // create a listening rectangle

    // const listeningRect = svg
    //   .append("rect")
    //   .attr("width", width)
    //   .attr("height", height);

    // // create the mouse move function

    // listeningRect.on("mousemove", function (event) {
    //   const [xCoord] = d3.pointer(event, this);
    //   const bisectDate = d3.bisector((d) => d.date).left;
    //   const x0 = xScale.invert(xCoord);
    //   const i = bisectDate(data, x0, 1);
    //   const d0 = data[i - 1];
    //   const d1 = data[i];
    //   const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //   const xPos = xScale(d.date);
    //   const yPos = yScale(d.value);

    //   // Update the circle position

    //   circle.attr("cx", xPos).attr("cy", yPos);

    //   // Add transition for the circle radius

    //   circle.transition().duration(50).attr("r", 5);

    //   // add in  our tooltip

    //   tooltip
    //     .style("display", "block")
    //     .style("left", `${xPos + 100}px`)
    //     .style("top", `${yPos + 50}px`)
    //     .html(
    //       `<strong>Date:</strong> ${d.date.toLocaleDateString()}<br><strong>Population:</strong> ${
    //         d.value !== undefined
    //           ? (d.value / 1000).toFixed(0) + "k"
    //           : "N/A"
    //       }`
    //     );
    // });
    // // listening rectangle mouse leave function

    // listeningRect.on("mouseleave", function () {
    //   circle.transition().duration(50).attr("r", 0);

    //   tooltip.style("display", "none");
    // });

    // add the lines
    const line = d3
      .line()
      .x((d) => xScale(d.date) + margin.left / 2)
      .y((d) => yScale(d.value));

    // Add the line path to the SVG element
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("d", (value) => line(value))
      .attr("fill", "none")
      .attr("stroke", "#777");
  }, [data]);

  return (
    <svg
      ref={mySVGRef}
      style={{ marginLeft: "100px", marginBottom: "50px" }}
    ></svg>
  );
};

export default LineChart;
