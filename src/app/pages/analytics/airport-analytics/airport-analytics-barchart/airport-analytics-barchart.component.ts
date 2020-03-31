import { Component, OnInit, ViewEncapsulation, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Axis, AxisDomain } from 'd3';
import * as d3 from 'd3';
//import { Item, DataService } from '../data.service';
export interface DataModel {
  gate: string;
  deliveries: number;
}
@Component({
 
  selector: 'ngx-airport-analytics-barchart',
  templateUrl: './airport-analytics-barchart.component.html',
  styleUrls: ['./airport-analytics-barchart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AirportAnalyticsBarchartComponent implements OnChanges {
  private bars: any;
  private tooltip :any;
  private xAxis: Axis<AxisDomain>;
  private xScale: any;
  private yAxis: Axis<AxisDomain>;
  private yScale: any;
  @ViewChild('barChart',{static:true})
  private chartContainer: ElementRef;

  @Input()
  data: any[];

  margin = { top: 20, right: 20, bottom: 30, left: 40 };

  constructor() { }

  ngOnInit() { }

  ngOnChanges(): void {
    if (!this.data) { return; }

    this.createChart();
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const data = this.data;

    d3.select(element).select('svg').remove();
    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', 345);
       this.tooltip = d3.select(element)
            .append('div')
            .attr('class', 'tooltip')
            .style('display', 'none')
            .style('opacity', 0);
    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;
    
    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map(d => d.gate));

    var xAxis = d3.axisBottom(x);

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.deliveries)]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

   

    svg.append('g')
      .attr('class', 'xAxis')
      .attr("transform", "translate(40," + 315 + ")")
      .call(xAxis);
    
    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Deliveries');

      svg.append("text")
      .attr("class", "x label")
      .attr("x", 460)
      .attr("y", 345)
      .text("Gate Number (name)");
      svg.append("text")
      .attr("class", "y label")
      .attr("y", 1)
      .attr("x", -220)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Deliveries (number)");   

      

    this.bars = g.selectAll('.bar')
      .remove()
          .exit()
          .data(data)
          .enter().append('rect')
          .attr('fill', '#00EEF0')
          .attr('class', d => d.deliveries> 0 ? 'bar bar--positive' : 'bar bar--negative');
    this.bars
      .attr('x', d => x(d.gate))
      .attr('y', y(0))
      .attr('width', x.bandwidth())
      .transition()
      .ease(d3.easeBounce)
      .duration(1000)
      .delay((d, i) => i * 80)
      .attr('y', d => y(d.deliveries))
      .attr('height',  d => contentHeight - y(d.deliveries));
       this.bars
      .on('mousemove', function (s) {
        //const percent = (Math.abs(s.abs / this.total) * 100).toFixed(2) + '%';
        this.tooltip
          .style('top', (d3.event.layerY + 15) + 'px')
          .style('left', (d3.event.layerX) + 'px')
          .style('display', 'block')
          .style('opacity', 1)
          .style('height', 'auto')
          .style('padding', '14px')
          .style('background', 'white')
          .style('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.6)')
          .html('Gate: ' + s.gate+ '<br>' +'Deliveries: ' + s.deliveries);
      }.bind(this))
      .on('mouseover', function (data, i, arr) {
        const interval = 3;

        d3.select(arr[i])
          .transition()
          .ease(d3.easeBounce)
          .duration(150)
          .attr('fill', '#09babb')
          .attr('x', d => x(d['gate']))
          .attr('width', x.bandwidth())
          .attr('y',  d => y(d['deliveries']))
          .attr('height',  d => contentHeight - y(d['deliveries']));

      
      }.bind(this))
      .on('mouseout', function (data, i, arr) {
        this.tooltip.style('display', 'none');
        this.tooltip.style('opacity', 0);

        d3.select(arr[i])
          .transition()
          .ease(d3.easeBounce)
          .duration(150)
          .attr('fill', '#00EEF0')
          .attr('x', d => x(d['gate']))
          .attr('width', x.bandwidth())
          .attr('y',  d => y(d['deliveries']))
          .attr('height', d => contentHeight - y(d['deliveries']));

       
      }.bind(this));
  }

  onResize(event) {
    this.createChart();
  }

}