import { Component, OnInit, ViewEncapsulation, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Axis, AxisDomain } from 'd3';
import * as d3 from 'd3';
import { ZoomControlStyle } from '@agm/core/services/google-maps-types';
export interface datas{
 "0":number;
 "15":number;
 "30":number;
 "45":number;
}
@Component({
  selector: 'ngx-groupedbar-chart-oea',
  templateUrl: './groupedbar-chart-oea.component.html',
  styleUrls: ['./groupedbar-chart-oea.component.scss']
})
export class GroupedbarChartOEAComponent implements OnInit {

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

  constructor() { 
    
  }

  ngOnInit() { }

  ngOnChanges(): void {
    if (!this.groupeddata) { return; }
    this.createChart();
  }
  chartType:any="";
  data1:datas[] =[];
  
  YaxisName: any;

  private createChart(): void {
    const element = this.chartContainer.nativeElement;

    d3.select(element).select('svg').remove();
    var vals =  this.groupeddata[0]&&this.groupeddata[0].data?this.groupeddata[0].data:[];
    this.chartType = this.groupeddata[0].type;
    
    if(this.chartType == "orders"){
      this.YaxisName = "Orders (number)";
    } else if(this.chartType == "cancellations"){
      this.YaxisName = "Cancellations (number)";
    } else {
      this.YaxisName = "5-Star Ratings (number)";
    }
    var formatyaxis = d3.format('.0f');
    
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
      svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", 585)
      .attr("y", 345)
      .text("Time (AM/PM)");
      svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 1)
      .attr("x", -120)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text(this.YaxisName);
  var x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);
  var x3 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  var x1 = d3.scaleBand()
      .padding(0.05);
  var formatxAxis = d3.format(',');
  var y = d3.scaleLinear()
      .rangeRound([height, 0])
      //d3.format('.0f')
      //.tickFormat();
  
  let x_axis_label = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm","12pm"]
   this.z = d3.scaleOrdinal()
   .range([ "#67E0F0", "#BD67F0", "#f07867", "#9bf067"]);
  this.data1 = vals;
 
  var keys = ['0','15','30','45'];
  var tooltip = d3.select(element).append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')
        .style('opacity', 0);
  x0.domain(x_axis_label.map(function (d:any) { return d; }));
  x3.domain(this.data1.map(function (d:any) { return d.time; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(this.data1, function (d:any) { return d3.max(keys, function (key) { return d[key]; }); })]).nice();
  g.append("g")
      .selectAll("g")
      .data(this.data1)
      .enter().append("g")
      .attr("transform",  (d:any)=> "translate(" + x3(d.time) + ",0)")
      .selectAll("rect")
      .data(d => keys.map(key => ({ key: key, value: d[key]}))) 
      .enter().append("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => {if(d.key == "0"){return '#67E0F0'}else if(d.key == '15'){return '#BD67F0'}else if(d.key == '30'){return '#f07867'}else if(d.key == '45'){return '#9bf067'}})
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
          .html("Time: " +(d.key =='0'?'0 to 14 Min':d.key =='15'?'15 to 29 Min':d.key =='30'?'30 to 44 Min':d.key =='45'?'45 to 59 Min':'') + "<br>" + "Count: " + (d.value));
    })
    .on("mouseout", function(d){ tooltip.style("display", "none");});

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
//      .call(d3.axisLeft(y).ticks(null, "s").tickFormat(formatyaxis))
//      .call(d3.axisLeft(y).ticks(null, "s").tickFormat(formatyaxis))
      .call(d3.axisLeft(y).ticks(null, "s").tickFormat(formatyaxis).tickValues(d3.range(y.domain()[0], y.domain()[1] + 1)))
 

      .append("text")
      .attr("x", 2)
//      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("y", y(y.ticks().pop()))

      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      //.attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
      

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill",d => {if(d == "0"){return '#67E0F0'}else if(d == '15'){return '#BD67F0'}else if(d == '30'){return '#f07867'}else if(d == '45'){return '#9bf067'}})

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d)  {if(d == "0"){return '0 to 14 min'}else if(d == '15'){return '15 to 29 min'}else if(d == '30'){return '30 to 44 min'}else if(d == '45'){return '45 to 59 min'}});
  }

  onResize(event) {
    this.createChart();
  }

}

