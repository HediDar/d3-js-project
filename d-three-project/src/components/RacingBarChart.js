import React, { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import "../App.css";
import UseInterval from "../Hooks/UseInterval";
import csvFile from "../user=17_project_id=130_2021-06-10_report.csv";

const getRandomIndex = (array) => {
  return Math.floor(array.length * Math.random());
};

const RacingBarChart = () => {
  const mySVGRef = useRef(null);
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [data, setData] = useState([
    {
      name: "alpha",
      value: 10,
      color: "#f4efd3",
    },
    {
      name: "beta",
      value: 15,
      color: "#cccccc",
    },
    {
      name: "charlie",
      value: 20,
      color: "#c2b0c9",
    },
    {
      name: "delta",
      value: 25,
      color: "#9656a1",
    },
    {
      name: "echo",
      value: 30,
      color: "#fa697c",
    },
    {
      name: "foxtrot",
      value: 35,
      color: "#fcc169",
    },
  ]);
  const width = 600; //this is the width of the svg
  const height = 200;

  useEffect(() => {
    //read a csv file
    // d3.csv(csvFile).then(function (data) {
    //   console.log(data);
    // });
    var svg = d3.select(mySVGRef.current);
    data.sort((a, b) => b.value - a.value);

    // Remove existing SVG element
    svg.selectAll("svg").remove(); // this is to remove the previous svg to avoid duplication
    // svg = d3  //this code is necessary when im displaying the graph on a div instead of an svg
    //   .select(mySVGRef.current)
    //   .append("svg") // add an svg to our div
    //   .attr("width", width) // width and height of the svg
    //   .attr("height", height);

    const yScale = d3
      .scaleBand()
      .paddingInner(0.1)
      .domain(data.map((value, index) => index)) // [0,1,2,3,4,5]
      .range([0, height]); //j'ai choisi height/2 pour avoir des barres plus ou moins minces
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (entry) => entry.value)]) // [0, 65 (example)]
      .range([0, width]); // [0, 400 (example)]

    svg
      .selectAll(".bar") //we want to draw a bar chart=> select all of existant elements with class bar in my svg
      .data(data, (entry, index) => entry.name) //.data(data) // we changed .data(data) because we need to identify its column in this array by something specific like name or id so that the transtion works correctly
      .join((enter) =>
        enter.append("rect").attr("y", (entry, index) => yScale(index))
      )
      // .join("rect") //as rectangles// this remplaces the join .join("rect") for a better transition

      .attr("class", "bar") // call the class of the bar elements bar,this line is  necessary
      .attr("fill", (entry) => entry.color)
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .transition()
      .attr("width", (entry) => xScale(entry.value))
      .attr("y", (entry, index) => yScale(index));
    // fixing the labels

    svg
      .selectAll(".label")
      .data(data, (entry, index) => entry.name)
      .join(
        (
          enter // this remplaces the join .join("text") for a better transition
        ) =>
          enter
            .append("text")
            .attr(
              "y",
              (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5
            )
      )
      .text((entry) => `🐎 ... ${entry.name} (${entry.value} meters)`)
      .attr("class", "label")
      .attr("x", 10)
      .transition()
      .attr("y", (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
  }, [data]);

  UseInterval(() => {
    if (start) {
      const randomIndex = getRandomIndex(data);
      setData(
        data.map((entry, index) =>
          index === randomIndex
            ? {
                ...entry,
                value: entry.value + 5,
              }
            : entry
        )
      );
      setIteration(iteration + 1);
    }
  }, 500);

  // const updateData = () => {
  //   //set interval me permet de run une fonction en loop chaque x ms
  //   var t = setInterval(() => {
  //     const min = Math.ceil(0);
  //     const max = Math.floor(5);
  //     const random = Math.floor(Math.random() * (max - min + 1)) + min;
  //     let myTranstionArray = data;
  //     myTranstionArray[random].value += 5;
  //     setData([...data, random]);
  //     setIteration((previousIterator) => previousIterator + 1);
  //   }, 1000);
  // };
  return (
    <div>
      <svg ref={mySVGRef}></svg>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button onClick={() => setStart(!start)}>
        {start ? "Stop the race" : "Start the race!"}
      </button>
      <br></br>
      {iteration}
    </div>
  );
};

export default RacingBarChart;
