import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useLanguage } from '@/components/providers/language-provider';

const GraphPopup = ({ onClose, isVisible, sValues, photonNumber}: {onClose: any, isVisible: boolean, sValues: number[], photonNumber: number}) => {
  if (!isVisible) return null;
  const {localize} = useLanguage();

  useEffect(() => {
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 55, bottom: 40, left: 55 };

    const svg = d3.select("#sGraph")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
      svg.selectAll("*").remove();

    const graph = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    const xScale = d3.scaleLinear().domain([0, photonNumber]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 4]).range([height, 0]);

    // X-axis
    graph.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .style("font-size", "16px")
      .append("text")
      .attr("fill", "white")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Photons"); 

    // Y-axis
    graph.append("g")
      .call(d3.axisLeft(yScale).ticks(8)) 
      .style("font-size", "16px")
      .append("text")
      .attr("fill", "white")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text('S'); 


    // Data points
    graph.selectAll(".dot")
      .data(sValues)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => xScale(i + 1))
      .attr("cy", d => yScale(d))
      .attr("r", 3)
      .attr("fill", "white");

    // Threshold line
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width + margin.left)
      .attr("y1", yScale(2 * Math.sqrt(2)) + margin.top)
      .attr("y2", yScale(2 * Math.sqrt(2)) + margin.top)
      .style("stroke", "red")
      .style("stroke-dasharray", "8");

    // Threshold label
    graph.append("text")
      .attr("x", width - 50)
      .attr("y", yScale(2 * Math.sqrt(2)) - 5)
      .attr("fill", "red")
      .attr("font-size", "16px")
      .attr("text-anchor", "end")
      .text("2√2 Threshold");

    // Threshold line
    svg.append("line")
    .attr("x1", margin.left)
    .attr("x2", width + margin.left)
    .attr("y1", yScale(2) + margin.top)
    .attr("y2", yScale(2) + margin.top)
    .style("stroke", "green")
    .style("stroke-dasharray", "8");

  // Threshold label
  graph.append("text")
    .attr("x", width - 50)
    .attr("y", yScale(2) - 5)
    .attr("fill", "green")
    .attr("font-size", "16px")
    .attr("text-anchor", "end")
    .text("2 Threshold");
  }, [sValues]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-center font-bold mb-4">{'CHSH'}</h2>
        <svg id="sGraph" className="block mx-auto"></svg>
        <button onClick={onClose} className="close-btn">x</button>
      </div>
    </div>
  );
};

export default GraphPopup;

