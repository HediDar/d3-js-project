import React, { useEffect, useRef } from "react";
import { select } from "d3";
import * as d3 from "d3";

const HorizontalBarCharts = () => {
  const mySVGRef = useRef(null);
  const data = [25, 30, 45, 60, 20, 65, 75, 300];
  const width = 600; //this is the width of the svg
  const height = 500;
  const margin = { top: 20, right: 0, bottom: 30, left: 40 };
  useEffect(() => {
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, 420]); // the const x code etale les data(de 25 a 300) avec leurs valeurs d'une facon lineaire sur un range starting from 0 pixel to 420 pixel width

    //the dif between scaleLinear and  scaleband => linear t9assim el tab donnee min 0 jusqua b comme ca 0,2,3,4,5,6,..,b
    // tandis que linear t9assem selonc les valeurs fournies ex [1,3,8,9,10,...,b] et pas d'une facon lineaire

    const y = d3
      .scaleBand()
      .domain(d3.range(data.length)) // this line returns an array like this relative to the data array: [0,1,2...,7](donne continues et lineaires),donc on
      .range([0, 20 * data.length]);// on etale 7 donnes sur 20*8 pixels (c la somme de largeur de toutes les barres)(donne discretes non lineaires)

    //the below code is used to switch positions between x and y coordinates
    // const y = d3
    //   .scaleLinear()
    //   .domain([0, d3.max(data, (d) => d.frequency)])
    //   .range([height - margin.bottom, margin.top]);

    // const x = d3
    //   .scaleBand()
    //   .domain(data.map((d) => d.letter))
    //   .rangeRound([margin.left, width - margin.right])
    //   .padding(0.1);

    const svg = d3
      .select(mySVGRef.current)
      .attr("width", width)
      .attr("height", y.range()[1])
      .attr("font-family", "sans-serif")
      .attr("font-size", "10")
      .attr("text-anchor", "end");

    const bar = svg
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d, i) => `translate(0,${y(i)})`);

    bar
      .append("rect")
      .attr("fill", "steelblue")
      .attr("width", x)
      .attr("height", y.bandwidth() - 1); //y.bandwidth returns the width of a single bar -1 so that the bars dont be collées

    bar
      .append("text") //add text to the bars
      .attr("fill", "black") // this line is the color of the text
      .attr("x", (d) => x(d) - 3) // coordinate of the x coordinate of the text (x(d)gives the coordinate at the limit so we substract 3 more)
      .attr("y", (y.bandwidth() - 1) / 2) // au centre de la barre presque
      .attr("dy", "0.35em")
      .text((d) => d);

    return svg.node();
  }, []);

  return (
    <svg
      ref={mySVGRef}
      style={{ background: "#eee", marginLeft: "50px" }}
    ></svg>
  );
};

export default HorizontalBarCharts;
