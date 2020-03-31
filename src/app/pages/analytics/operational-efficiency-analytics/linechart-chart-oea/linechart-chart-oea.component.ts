import { Component, OnInit, ViewEncapsulation, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Axis, AxisDomain } from 'd3';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { DeliveryDuration } from './DeliveryDurationModel';


@Component({
  selector: 'ngx-linechart-chart-oea',
  templateUrl: './linechart-chart-oea.component.html',
  styleUrls: ['./linechart-chart-oea.component.scss']
})
export class LinechartChartOEAComponent implements OnInit {

  private margin:any = {left:10, right:10, top: 10, bottom: 20}
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private lineGenerator: any;

  element:any;
  @ViewChild('lineChartoea',{static:true})
  private chartContainer: ElementRef;
  @Input()
  linechartdata: any;
  constructor() {
    
    
  }

  ngOnInit() {

  }

  ngOnChanges() { 
    if (!this.linechartdata && !this.linechartdata.status ) { return; }

    this.createChart(); 
  }; 
  createChart() {
    this.element = this.chartContainer.nativeElement;
    d3.select(this.element).select('svg').remove();
    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.element.offsetHeight - this.margin.top - this.margin.bottom;
 
    this.width = this.element.offsetWidth;
    this.height = 345; 

    this.renderchart(this.linechartdata,this.element);
  }
 
private renderchart(data:DeliveryDuration,element:any) { 
   var x = d3.scaleTime().range([0, this.width - 80]);
   var y = d3.scaleLinear().range([this.height - 80, 0]);
      
      var width = this.element.offsetWidth;
      var height = 345;
      var margin = 50;
      var duration = 250;
      
      var lineOpacity = "0.25";
      var lineOpacityHover = "0.85";
      var otherLinesOpacityHover = "0.1";
      var lineStroke = "1.5px";
      var lineStrokeHover = "2.5px";
      
      var circleOpacity = '0.85';
      var circleOpacityOnLineHover = "0.25"
      var circleRadius = 3;
      var circleRadiusHover = 6;
      
      
      /* Format Data */
      var parseDate = d3.timeParse("%Y");
      data.chartData.forEach(function(d) { 
        d.chartData.forEach(function(d) {
          //d.time = parseDate(d.time);
          d.avgTime = +d.avgTime;    
        });
      });
      
      
      /* Scale */
      var xScale = d3.scaleTime()
        .domain(d3.extent(data.chartData[0].chartData, d => d.time ))
        .range([0, width-margin]);
     // console.log( d3.max(data.chartData[0].chartData, d => d.avgTime))
      var yScale = d3.scaleLinear()
        //.domain([0, d3.max(data.chartData[0].chartData, d => d.avgTime)])
        .range([height-margin, 0]);
        yScale.domain([
          d3.min(data.chartData, d => d3.min(d.chartData, c => c.avgTime)),
          d3.max(data.chartData, d => d3.max(d.chartData, c => c.avgTime))
        ]).nice();
      var color = d3.scaleOrdinal(["#67E0F0", "#BD67F0", "#f07867", "#9bf067", "#dff067"]);
      
      // Add tooltip
     
    var tooltip = d3.select(element).append('div')
          .attr('class', 'tooltip')
          //.style('display', 'none')
          .style('opacity', 0);
     

      /* Add SVG */
      var svg = d3.select(element).append("svg")
        .attr("width", (width+margin)+"px")
        .attr("height", (height+margin)+"px")
        .append('g')
        .attr("transform", `translate(${margin}, ${margin})`);
      
      
      /* Add line into SVG */
      var line = d3.line()
      .x(function(d:any) { return xScale(d.time) })
      .y(function(d:any) { return yScale(d.avgTime) });
        //.x(d => xScale(d))
        //.y(d => yScale(d.price));
      

        var legend = svg.selectAll('g')
        .data(data.chartData)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr("transform", `translate(-180, -40)`);
  //-40, 45
      legend.append('rect')
        .attr('x', width + 100)
        .attr('y', function(d, i) {
          return i * 20;
        })
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', function(d,i:any) {
          return color(i);
        });
  
      legend.append('text')
      .attr("font-family", "sans-serif")
        .attr('x', width - 40)
        .attr('y', function(d, i) {
          return (i * 20) + 15;
        })
        .text(function(d) {
          return d.name;
        });
   
      let lines = svg.append('g')
        .attr('class', 'lines');
      
      lines.selectAll('.line-group')
        .data(data.chartData).enter()
        .append('g')
        .attr('class', 'line-group')  
        .on("mouseover", function(d:any, i:any) {
            svg.append("text")
              .attr("class", "title-text")
              .style("fill", color(i))        
              .text(d.name)
              .attr("text-anchor", "middle")
              .attr("x", (width-margin)/2)
              .attr("y", 5);
          })
        .on("mouseout", function(d:any) {
            svg.select(".title-text").remove();
          })
        .append('path')
        .attr('class', 'line') 
        .attr('d', function(d:any) { return line(d.chartData) })
        //.attr('d', d => line(d.chartData))
        .style('stroke', (d:any, i:any) => color(i))
        .style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            d3.selectAll('.line')
                .style('opacity', otherLinesOpacityHover);
            d3.selectAll('.circle')
                .style('opacity', circleOpacityOnLineHover);
            d3.select(this)
              .style('opacity', lineOpacityHover)
              .style("stroke-width", lineStrokeHover)
              .style("cursor", "pointer");
          })
        .on("mouseout", function(d) {
            d3.selectAll(".line")
                .style('opacity', lineOpacity);
            d3.selectAll('.circle')
                .style('opacity', circleOpacity);
            d3.select(this)
              .style("stroke-width", lineStroke)
              .style("cursor", "none");
          }) 
      /* Add circles in the line */
      lines.selectAll("circle-group")
        .data(data.chartData).enter()
        .append("g")
        .style("fill", (d:any, i:any) => color(i))
        .selectAll("circle")
        .data(d => d.chartData).enter()
        .append("g")
        .attr("class", "circle")  
        .on("mouseover", function(d:any) { 
          tooltip.html("Minutes: " + d.minutes + "<br />Avarege Time: " + d.avgTime);
 
      //     // show tooltip
      tooltip
                .transition().duration(300)
               .style("opacity", 20).style("stroke-width", 0.5);
 
          })
        .on("mouseout", function(d) {
          tooltip
          .transition().duration(300)
          .style("opacity", 0).style("stroke-width", 0.5);
          
          })
          .on("mousemove", function(d){
            tooltip
            .style('top', (d3.event.layerY + 15) + 'px')
                      .style('left', (d3.event.layerX) + 'px')
                     // .style('display', 'block')
                      //.style('opacity', 1)
                      .style('height', 'auto')
                      .style('background', 'white')
                      .style('padding', '14px')
                      .style('background', 'white')
                      .style('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.6)')
              .html("Minutes: " + d.minutes + "<br />Avarege Time: " + d.avgTime);
          })
        .append("circle")
        .attr("cx",function(d:any) { return xScale(d.time) })
        .attr("cy",function(d:any) { return yScale(d.avgTime) })
        .attr("r", circleRadius)
        .style('opacity', circleOpacity)
        .on("mouseover", function(d) {
              d3.select(this)
                .transition()
                .duration(duration)
                .attr("r", circleRadiusHover);
            })
          .on("mouseout", function(d) {
              d3.select(this) 
                .transition()
                .duration(duration)
                .attr("r", circleRadius);
            });
      
      
      /* Add Axis into SVG */
      var xAxis = d3.axisBottom(xScale).ticks(5);
      var yAxis = d3.axisLeft(yScale).ticks(5);
      
      svg.append("g")
        .attr("class", "x label")
        .attr("transform", `translate(0, ${height-margin})`)
        .call(xAxis)
        .append('text')
        .attr("y", 35)
        .attr("x", 510)
        

       // .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Time (AM/PM)");
      
      svg.append("g")
        .attr("class", "y label")
        .call(yAxis)
        .append('text')
        .attr("y", -30)
        .attr("x", -50)
        
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Average Delivery Duration (mins)"); 
        
};
 
  onResize(event) {
    this.createChart();
  }

}

