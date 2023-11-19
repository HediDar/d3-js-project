import React, { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import "../App.css";
import "./styles/radarChart.css";
import csvFile from "../jdi_data_daily.csv";

const RadarChart = ({ numberOfCircles, radius }) => {
  const mySVGRef = useRef(null);
  const margin = { top: 70, right: 30, bottom: 40, left: 80 };
  //   const width = 1200 - margin.left - margin.right;
  //   const height = 500 - margin.top - margin.bottom;
  const width = 500;
  const height = 500;
  const [data, setData] = useState([
    {
      windBearing: 120,
      moonPhase: 160,
      maxTemp: 40,
      pressure: 86,
      humidity: 200,
      windSpeed: 66,
    },
  ]);
  //populate the data with a random set of information

  useEffect(() => {
    const svg = d3.select(mySVGRef.current);
    svg.html(null);
    svg.attr("width", "500").attr("height", "500");

    //creating one circle
    // const circle = svg
    //   .append("circle")
    //   .attr("r", 100)
    //   .attr("fill", "steelblue")
    //   .attr("cx", width / 2)
    //   .attr("cy", height / 2)
    //   .style("stroke", "white")
    //   .attr("opacity", 0.2) //transparence
    //   .style("pointer-events", "none");
    // creating multiple circles depending on the props numberOfCircles and the radius of each circle
    for (let index = 1; index < numberOfCircles + 1; index++) {
      const c = svg
        .append("circle")
        .attr("r", index * radius)
        .attr("class", "bar")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("stroke", "#D3D3D3")
        .style("pointer-events", "none");
      if (index === numberOfCircles + 1) {
        c.attr("fill", "blue").attr("opacity", 0.1);
      } else c.attr("fill", " none");
    }
    // svg
    //   .append("line")
    //   .attr("x1", width / 2)
    //   .attr("y1", 0)
    //   .attr("x2", width / 2)
    //   .attr("y2", height - 2)
    //   .attr("fill", "none")
    //   .attr("stroke", "#777");
    //first line
    svg
      .append("line")
      .attr("x1", width / 2)
      .attr("y1", height / 2 - radius * numberOfCircles)
      .attr("x2", width / 2)
      .attr("y2", height - (height / 2 - radius * numberOfCircles))
      .attr("fill", "none")
      .attr("stroke", "#D3D3D3");

    //second line
    svg
      .append("line")
      .attr("x1", width / 2)
      .attr("y1", height / 2 - radius * numberOfCircles)
      .attr("x2", width / 2)
      .attr("y2", height - (height / 2 - radius * numberOfCircles))
      .attr("fill", "none")
      .attr("stroke", "#D3D3D3")
      .attr("transform", `rotate(60, ${width / 2}, ${height / 2})`);

    //third line
    svg
      .append("line")
      .attr("x1", width / 2)
      .attr("y1", height / 2 - radius * numberOfCircles)
      .attr("x2", width / 2)
      .attr("y2", height - (height / 2 - radius * numberOfCircles))
      .attr("fill", "none")
      .attr("stroke", "#D3D3D3")
      .attr("transform", `rotate(-60, ${width / 2}, ${height / 2})`);

    const myObjectKeys = Object.keys(data[0]);

    for (let index = 0; index < myObjectKeys.length; index++) {
      let myRotationAngle = -60 * index;
      let originalX;
      let originalY;
      if (index === 0 || index === myObjectKeys.length / 2) {
        originalX = width / 2;
        originalY = height / 2 - radius * numberOfCircles - 20;
      } else {
        originalX = width / 2;
        originalY = height / 2 - radius * numberOfCircles - 40;
      }
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("fill", "none")
        .attr("x", originalX)
        .attr("y", originalY)
        .text((d) => {
          return "empty text";
        })
        .attr(
          "transform",
          `rotate(${myRotationAngle}  , ${width / 2}, ${height / 2})`
        );

      // Get rotation angle in radians
      const rotationAngle = (myRotationAngle * Math.PI) / 180;

      // Calculate rotated coordinates
      const rotatedX =
        Math.cos(rotationAngle) * (originalX - width / 2) -
        Math.sin(rotationAngle) * (originalY - height / 2) +
        width / 2;
      const rotatedY =
        Math.sin(rotationAngle) * (originalX - width / 2) +
        Math.cos(rotationAngle) * (originalY - height / 2) +
        height / 2;

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text((d) => {
          return myObjectKeys[index];
        })
        .style("fill", "black")
        .attr("x", rotatedX)
        .attr("y", rotatedY);
    }
    let previousX, previousY;
    const polygonPoints = [];
    //draw the 6 points and their lines
    for (let index = 0; index < myObjectKeys.length; index++) {
      let myRotationAngle = -60 * index;
      let myPreviousRotationAngle;
      let originalY2;

      //draw the 6 circle points that are visible

      svg
        .append("circle")
        .attr("r", 5)
        .attr("class", "pointCircle")
        .attr("id", myObjectKeys[index])
        .attr("cx", width / 2)
        .attr("cy", height / 2 - data[0][myObjectKeys[index]])
        .attr("fill", "#ADD8E6")
        .attr(
          "transform",
          `rotate(${myRotationAngle}, ${width / 2}, ${height / 2})`
        );

      //draw the 6 circle points that are invisible
      let myCircles = svg
        .append("circle")
        .attr("r", 20)
        .attr("class", "pointCircleInvisible")
        .attr("id", myObjectKeys[index])
        .attr("cx", width / 2)
        .attr("cy", height / 2 - data[0][myObjectKeys[index]])
        .attr("fill", "white")
        .attr("opacity", 0)
        .attr(
          "transform",
          `rotate(${myRotationAngle}, ${width / 2}, ${height / 2})`
        );

      //draw the 6 lines
      if (index !== 0) myPreviousRotationAngle = -60 * (index - 1);
      else myPreviousRotationAngle = -60 * (myObjectKeys.length - 1);

      const centerX = width / 2;
      const centerY = height / 2;
      const originalX = centerX;
      const originalY = centerY - data[0][myObjectKeys[index]];
      const rotationAngle = (myRotationAngle * Math.PI) / 180;

      const rotatedX =
        Math.cos(rotationAngle) * (originalX - centerX) -
        Math.sin(rotationAngle) * (originalY - centerY) +
        centerX;
      const rotatedY =
        Math.sin(rotationAngle) * (originalX - centerX) +
        Math.cos(rotationAngle) * (originalY - centerY) +
        centerY;

      const centerX2 = width / 2;
      const centerY2 = height / 2;
      const originalX2 = centerX2;
      if (index !== 0) originalY2 = centerY2 - data[0][myObjectKeys[index - 1]];
      else
        originalY2 = centerY2 - data[0][myObjectKeys[myObjectKeys.length - 1]];
      const rotationAngle2 = (myPreviousRotationAngle * Math.PI) / 180;

      const rotatedX2 =
        Math.cos(rotationAngle2) * (originalX2 - centerX2) -
        Math.sin(rotationAngle2) * (originalY2 - centerY2) +
        centerX2;
      const rotatedY2 =
        Math.sin(rotationAngle2) * (originalX2 - centerX2) +
        Math.cos(rotationAngle2) * (originalY2 - centerY2) +
        centerY2;

      svg
        .append("line")
        .transition()
        .duration(1000)
        .attr("x1", rotatedX2)
        .attr("y1", rotatedY2)
        .attr("x2", rotatedX)
        .attr("y2", rotatedY)
        .attr("stroke", "#4682b4")
        .attr("stroke-width", 2);

      //populate the polygone
      polygonPoints.push(`${rotatedX2},${rotatedY2}`);
      polygonPoints.push(`${rotatedX},${rotatedY}`);
      let myRect;
      myCircles
        .on("mouseenter", (event, value) => {
          svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("id", "labelsOnMouseOn")
            .text((d) => {
              return data[0][event.target.id];
            })
            .style("fill", "black")
            .attr("x", rotatedX + 25)
            .attr("y", rotatedY + 25);

          //add tooltip rect
          svg
            .append("rect")
            .attr("id", "rectToolTip")
            .attr("width", 130)
            .attr("height", 50)
            .attr("x", 500)
            .attr("y", 200)
            //color of each rect
            .attr("fill", "steelblue")
            .attr("opacity", 0.1);

          svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("id", "labelsOnMouseOn2")
            .text((d) => {
              return myObjectKeys[index] + ":" + data[0][myObjectKeys[index]];
            })
            .style("fill", "black")
            .attr("x", 565)
            .attr("y", 225);
        })
        .on("mouseout", function (event, d) {
          // Hide the text
          svg.select("#rectToolTip").remove();
          svg.select("#labelsOnMouseOn").remove();
          svg.select("#labelsOnMouseOn2").remove();
        });
    }
    //add the polygon to the svg and color it
    svg
      .append("polygon")
      .transition()
      .duration(1000)
      .attr("points", polygonPoints.join(" "))

      .attr("fill", "steelblue")
      .attr("opacity", 0.3); // Adjust the opacity to your
  }, [data]);

  return (
    <div>
      <svg
        ref={mySVGRef}
        style={{ marginLeft: "100px", marginBottom: "50px" }}
      ></svg>

      <button
        onClick={useCallback(() => {
          const min = Math.ceil(20);
          const max = Math.floor(240);

          let myTransitionTab = [];
          myTransitionTab.push({
            windBearing: Math.floor(Math.random() * (max - min + 1)) + min,
            moonPhase: Math.floor(Math.random() * (max - min + 1)) + min,
            maxTemp: Math.floor(Math.random() * (max - min + 1)) + min,
            pressure: Math.floor(Math.random() * (max - min + 1)) + min,
            humidity: Math.floor(Math.random() * (max - min + 1)) + min,
            windSpeed: Math.floor(Math.random() * (max - min + 1)) + min,
          });
          setData(myTransitionTab);
        }, [data])}
      >
        generate random data
      </button>
    </div>
  );
};

export default RadarChart;
