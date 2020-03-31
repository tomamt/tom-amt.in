import { Component, OnInit, ViewEncapsulation, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Axis, AxisDomain } from 'd3';
import * as d3 from 'd3';
@Component({
  selector: 'ngx-grouped-bar-chart-via',
  templateUrl: './grouped-bar-chart-via.component.html',
  styleUrls: ['./grouped-bar-chart-via.component.scss']
})
export class GroupedBarChartVIAComponent implements OnChanges {
  private bars: any;
  private tooltip :any;
  private xAxis: Axis<AxisDomain>;
  private xScale: any;
  private yAxis: Axis<AxisDomain>;
  private yScale: any;
  @ViewChild('barChartvia',{static:true})
  private chartContainer: ElementRef;
  z:any;
  @Input()
  groupeddata: any[];

  margin = { top: 20, right: 20, bottom: 30, left: 40 };

  constructor() { }

  ngOnInit() { }

  ngOnChanges(): void {
    if (!this.groupeddata) { return; }

    this.createChart();
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    //const data = this.groupeddata;

    d3.select(element).select('svg').remove();
    var vals =  this.groupeddata;
    
    
    /*var container = d3.select(element).append('svg')
                  .attr('width', element.offsetWidth)
                  .attr('height', 345);*/
      var svg = d3.select(element).append('svg')
                .attr('width', element.offsetWidth)
                .attr('height', 345);
     this.tooltip = d3.select(element)
          .append('div')
          .attr('class', 'tooltip')
          .style('display', 'none')
          .style('opacity', 0);
      var margin = { top: 20, right: 20, bottom: 30, left: 40 };
      var width = +svg.attr("width") - margin.left - margin.right;
      var height = +svg.attr("height") - margin.top - margin.bottom;
      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  var x1 = d3.scaleBand()
      .padding(0.05);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);
  
  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
   this.z = d3.scaleOrdinal()
   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  var data = vals;
  var keys = Object.keys(data[0]).slice(1);
  
  //const  = d3.tip().html(d=> d.value);
  var tooltip = d3.select(element).append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')
        .style('opacity', 0);
  x0.domain(data.map(function (d) { return d.State; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function (d) { return d3.max(keys, function (key) { return d[key]; }); })]).nice();
  g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform",  (d)=> "translate(" + x0(d.State) + ",0)")
      .selectAll("rect")
      .data(d => keys.map(key => ({ key: key, value: d[key]}))) 
      .enter().append("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => {if(d.key == '65 Years and Over'){return '#98abc5'}else if(d.key == '45 to 64 Years'){return '#8a89a6'}else if(d.key == '25 to 44 Years'){return '#7b6888'}else if(d.key == '18 to 24 Years'){return '#a05d56'}else if(d.key == '14 to 17 Years'){return '#a05d56'}else if(d.key == '5 to 13 Years'){return '#d0743c'}else if(d.key == 'Under 5 Years'){return '#ff8c00'}})
      .on("mousemove", function(d){
        tooltip
        .style('top', (d3.event.layerY + 15) + 'px')
                  .style('left', (d3.event.layerX) + 'px')
                  .style('display', 'block')
                  .style('opacity', 1)
                  .style('height', 'auto')
                  .style('background', 'white')
                  .style('padding', '14px')
                  .style('background', 'white')
                  .style('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.6)')
          .html((d.key) + "<br>" + "" + (d.value));
    })
    .on("mouseout", function(d){ tooltip.style("display", "none");});

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population")
      

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
      

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill",this.z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) { return d; });
  }

  onResize(event) {
    this.createChart();
  }

}
