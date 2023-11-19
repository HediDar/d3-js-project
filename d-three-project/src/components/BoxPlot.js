import React, { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import "../App.css";

const BoxPlot = () => {
  const mySVGRef = useRef(null);
  const min = useRef(0);
  const max = useRef(0);
  const median = useRef(0);
  const upperQuartile = useRef(0);
  const lowerQuartile = useRef(0);
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  const [data, setData] = useState([5, 6, 10, 16, 17, 18, 20, 32, 40, 46]);
  // [5, 10, 16, 17, 18, 20, 32]
  useEffect(() => {
    //sorting the array
    let myTranstionArray = [...data];
    myTranstionArray.sort(function (a, b) {
      return a - b;
    });
    setData(myTranstionArray);

    if (data.length % 2 === 1) {
      median.current = data[Math.trunc(data.length / 2)];
      upperQuartile.current = data[Math.trunc(data.length * 0.75)];
      lowerQuartile.current = data[Math.trunc(data.length * 0.25)];
    }

    if (data.length % 2 === 0) {
      median.current = (data[data.length / 2 - 1] + data[data.length / 2]) / 2;
      lowerQuartile.current =
        (data[Math.trunc(data.length * 0.25) - 1] +
          data[Math.trunc(data.length * 0.25)]) /
        2;

      upperQuartile.current =
        (data[Math.trunc(data.length * 0.75) - 1] +
          data[Math.trunc(data.length * 0.75)]) /
        2;
    }
    min.current = data[0];
    max.current = data[data.length - 1];
    //we can sort the array using d3 like this

    //     var data_sorted = data.sort(d3.ascending)
    // var q1 = d3.quantile(data_sorted, .25)
    // var median = d3.quantile(data_sorted, .5)
    // var q3 = d3.quantile(data_sorted, .75)
    // var interQuantileRange = q3 - q1
    // var min = q1 - 1.5 * interQuantileRange
    // var max = q1 + 1.5 * interQuantileRange
  }, []);

  useEffect(() => {
    var svg = d3.select(mySVGRef.current);
    //so that we dont have duplication
    svg.html(null);
    svg
      // .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // y axis implementation
    const xScale = d3.scaleLinear().domain([0, max.current]).range([0, width]);

    var x_axis = d3
      .axisBottom() //axis bottom positions the numbers of the axis below the axis, so we need a y translation so that the axis are really in the botom
      .scale(xScale);
    svg
      .append("g") // add a group element that will contain our axis The <g> element is a container that groups multiple SVG elements together
      .attr("transform", "translate(0, " + height + ")")
      .call(x_axis)
      .style("font-size", "11")
      //remove the x axis
      .call((g) => g.select(".domain").remove())
      //remove the ticks
      .selectAll(".tick line")
      .style("stroke-opacity", 0);
    const rectHeight = 50;
    svg
      .append("line")
      .attr("x1", xScale(min.current))
      .attr("y1", height * 0.75 - rectHeight / 2)
      .attr("x2", xScale(lowerQuartile.current))
      .attr("y2", height * 0.75 - rectHeight / 2)
      .attr("stroke", "#808080");

    svg
      .append("line")
      .attr("x1", xScale(upperQuartile.current))
      .attr("y1", height * 0.75 - rectHeight / 2)
      .attr("x2", xScale(max.current))
      .attr("y2", height * 0.75 - rectHeight / 2)
      .attr("stroke", "#808080");

    svg
      .append("rect")
      .attr("x", xScale(lowerQuartile.current))
      .attr("y", height * 0.75 - rectHeight)
      .attr("height", rectHeight)
      .attr(
        "width",
        ((median.current - lowerQuartile.current) / max.current) * width
      )
      // .attr("stroke", "black")
      .attr("opacity", 0.1)
      .style("fill", "#69b3a2");

    svg
      .append("rect")
      .attr("x", xScale(median.current))
      .attr("y", height * 0.75 - rectHeight)
      .attr("height", rectHeight)
      .attr(
        "width",
        ((upperQuartile.current - median.current) / max.current) * width
      )
      // .attr("stroke", "black")
      .attr("opacity", 0.3)
      .style("fill", "#69b3a2");
    //median line

    svg
      .append("line")
      .attr("x1", xScale(median.current))
      .attr("y1", height * 0.75 - rectHeight)
      .attr("x2", xScale(median.current))
      .attr("y2", height * 0.75)
      .attr("stroke", "#808080");
    //add vertical lines

    svg
      .selectAll("xGrid")
      .data(xScale.ticks())
      .join("line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", 100)
      .attr("y2", height)
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5);

    //adding the circle points
    svg
      .append("circle")
      .attr("r", 3)
      .attr("class", "pointCircle")
      .attr("cx", xScale(min.current))
      .attr("cy", height * 0.75 - rectHeight / 2)
      .attr("fill", "#ADD8E6");

    svg
      .append("circle")
      .attr("r", 3)
      .attr("class", "pointCircle")
      .attr("cx", xScale(lowerQuartile.current))
      .attr("cy", height * 0.75 - rectHeight / 2)
      .attr("fill", "#ADD8E6");

    svg
      .append("circle")
      .attr("r", 3)
      .attr("class", "pointCircle")
      .attr("cx", xScale(median.current))
      .attr("cy", height * 0.75 - rectHeight / 2)
      .attr("fill", "#ADD8E6");

    svg
      .append("circle")
      .attr("r", 3)
      .attr("class", "pointCircle")
      .attr("cx", xScale(upperQuartile.current))
      .attr("cy", height * 0.75 - rectHeight / 2)
      .attr("fill", "#ADD8E6");

    svg
      .append("circle")
      .attr("r", 3)
      .attr("class", "pointCircle")
      .attr("cx", xScale(max.current))
      .attr("cy", height * 0.75 - rectHeight / 2)
      .attr("fill", "#ADD8E6");
  }, [data]);

  return <svg ref={mySVGRef}></svg>;
};

export default BoxPlot;
