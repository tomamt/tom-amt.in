import { Component, OnInit, ViewEncapsulation, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Axis, AxisDomain } from 'd3';
import * as d3 from 'd3';
//import { Item, DataService } from '../data.service';
export interface DataModel {
  month: string;
  count: number;
}
@Component({
  selector: 'ngx-bar-chart-via',
  templateUrl: './bar-chart-via.component.html',
  styleUrls: ['./bar-chart-via.component.scss']
})
export class BarChartVIAComponent  implements OnChanges {
  private bars: any;
  private tooltip :any;
  private xAxis: Axis<AxisDomain>;
  private xScale: any;
  private yAxis: Axis<AxisDomain>;
  private yScale: any;
  @ViewChild('barChartvia',{static:true})
  private chartContainer: ElementRef;

  @Input()
  data: any[];
  data1:any[];

  margin = { top: 20, right: 20, bottom: 30, left: 70 };

  Xtype: string='';
  Ytype: string='';
  tooltipValueA:any;
  tooltipValueB:any;
  currency:any='';

  constructor() {
    
   }

  ngOnInit() { }

  ngOnChanges(): void {
    if (!this.data[0].data) { return; }

    this.createChart();
  }
  
  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    this.data1 = this.data[0]&&this.data[0].data?this.data[0].data:[];
    const type = this.data[0]&&this.data[0].type?this.data[0].type:[];
    this.currency='';
    if(type=="Location"){
      this.Xtype = "Gate Number (name)";
      this.Ytype = "Orders (number)";
      this.tooltipValueA = "Gate: ";
      this.tooltipValueB = "Count: ";
    }else if(type=="Orders"){
      this.Xtype="Month (time)";
      this.Ytype = "Orders (number)";
      this.tooltipValueA = "Month: ";
      this.tooltipValueB = "Count: ";
    } else {
      this.Xtype="Month (time)";
      this.Ytype = "Sales (USD)";
      this.tooltipValueA = "Month: ";
      this.tooltipValueB = "Amount: ";
      this.currency = localStorage.getItem('CurrencySymbol');
    }
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
      .domain(this.data1.map(d => d.month));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(this.data1, d => d.count)]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Count');
    
    svg.append("text")
      .attr("class", "x label")
      .attr("x", 532)
      .attr("y", 345)
      .text(this.Xtype);
    svg.append("text")
      .attr("class", "y label")
      .attr("y", 1)
      .attr("x", -220)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text( this.Ytype); 
         
    this.bars = g.selectAll('.bar')
      .remove()
          .exit()
          .data(this.data1)
          .enter().append('rect')
          .attr('fill', '#00EEF0')
          .attr('class', d => d.count> 0 ? 'bar bar--positive' : 'bar bar--negative');
    this.bars
      .attr('x', d => x(d.month))
      .attr('y', y(0))
      .attr('width', x.bandwidth())
      .transition()
      .ease(d3.easeBounce)
      .duration(1000)
      .delay((d, i) => i * 80)
      .attr('y', d => y(d.count))
      .attr('height',  d => contentHeight - y(d.count));
       this.bars
      .on('mousemove', function (s) {
        //const percent = (Math.abs(s.abs / this.total) * 100).toFixed(2) + '%';
        this.tooltip
          .style('left', (d3.event.layerX) + 'px')
          .style('display', 'block')
          .style('opacity', 1)
          .style('height', 'auto')
          .style('top', '60px')
          .style('background', 'white')
          .style('padding', '14px')
          .style('background', 'white')
          .style('box-shadow', '0 1px 3px rgba(0, 0, 0, 0.6)')
          .html(this.tooltipValueA + s.month +'<br>'+ this.tooltipValueB + '<b>'+ this.currency+'</b>'+ s.count);
      }.bind(this))
      .on('mouseover', function (data, i, arr) {
        const interval = 3;

        d3.select(arr[i])
          .transition()
          .ease(d3.easeBounce)
          .duration(150)
          .attr('fill', '#09babb')
          .attr('x', d => x(d['month']))
          .attr('width', x.bandwidth())
          .attr('y',  d => y(d['count']))
          .attr('height',  d => contentHeight - y(d['count']));

      
      }.bind(this))
      .on('mouseout', function (data, i, arr) {
        this.tooltip.style('display', 'none');
        this.tooltip.style('opacity', 0);

        d3.select(arr[i])
          .transition()
          .ease(d3.easeBounce)
          .duration(150)
          .attr('fill', '#00EEF0')
          .attr('x', d => x(d['month']))
          .attr('width', x.bandwidth())
          .attr('y',  d => y(d['count']))
          .attr('height', d => contentHeight - y(d['count']));

       
      }.bind(this));
  }

  onResize(event) {
    this.createChart();
  }

}