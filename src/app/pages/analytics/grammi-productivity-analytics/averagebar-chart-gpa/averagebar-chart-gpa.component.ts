import {
	Component,
	OnInit,
	ViewEncapsulation,
	Input,
	OnChanges,
	ViewChild,
	ElementRef
} from '@angular/core';
import {
	Axis,
	AxisDomain
} from 'd3';
import * as d3 from 'd3';
export interface DataModel {
	monthName: string;
	avgTime: string;
}
@Component({
	selector: 'ngx-averagebar-chart-gpa',
	templateUrl: './averagebar-chart-gpa.component.html',
	styleUrls: ['./averagebar-chart-gpa.component.scss']
})
export class AveragebarChartGPAComponent implements OnInit {
	private  bars:  any;
	data: DataModel[] = [];
	private tooltip : any;
	private  xAxis:  Axis < AxisDomain > ;  
	private  xScale:  any;  
	private  yAxis:  Axis < AxisDomain > ;  
	private  yScale:  any;
	@ViewChild('barChartvia', {
		static: true
	})
	private chartContainer: ElementRef;
	z: any;
	@Input()
	groupeddata: any[];

	margin = {
		top: 20,
		right: 20,
		bottom: 30,
		left: 40
	};

	constructor() {}

	ngOnInit() {}

	ngOnChanges(): void {
		if (!this.groupeddata) {
			return;
		}

		this.createChart();
	}

	private createChart(): void {
		const element = this.chartContainer.nativeElement;
		d3.select(element).select('svg').remove();
		this.data = this.groupeddata[0] && this.groupeddata[0].data ? this.groupeddata[0].data : [];
		//console.log("data",this.data)
		var averagetime = this.groupeddata[0] && this.groupeddata[0].avgTime ? this.groupeddata[0].avgTime : [];

		var margin = {
			top: 20,
			right: 20,
			bottom: 30,
			left: 40
		};

		var width = 800 - margin.left - margin.right,
			height = 395 - margin.top - margin.bottom;
		const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
		var x = d3.scaleBand()
			.rangeRound([0, contentWidth])
			.padding(0.1)

		var x2 = d3.scaleBand()
			.domain(this.data.map(function (d: any) {
				return d.monthName;
			}))
			.range([0, element.offsetWidth + 650]);

		var y = d3.scaleLinear()
			.range([height, 0]);

		var xAxis = d3.axisBottom(x);

		var yAxis = d3.axisLeft(y);
		var color = d3.scaleOrdinal(d3.schemeCategory10);

		 
		this.tooltip  =  d3.select(element)      .append('div')      .attr('class',  'tooltip')      .style('display',  'none')      .style('opacity',  0);

		var svg = d3.select(element).append('svg')
			.attr("width", element.offsetWidth + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + 75 + "," + margin.top + ")");

		x.domain(this.data.map(function (d) {
			return d.monthName;
		}));
		y.domain([0, d3.max(this.data, function (d: any) {
			return d.avgTime;
		})]);


		svg.append('g')
			.attr('class', 'xAxis')
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		svg.append("g")
			.attr("class", "axis axis--y")
			.call(yAxis)
			.append("text")

			.attr("y", 6)
			.attr("dy", "0em")
			.attr("text-anchor", "end")
			.text("avgTime ($)");

		svg.append("text")
			.attr("class", "x label")
			.attr("x", 475)
			.attr("y", 373)
			.text("Month (time)");
		svg.append("text")
			.attr("class", "y label")
			.attr("y", -65)
			.attr("x", -220)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text("Time (mins)");

		var bars = svg.append("g").attr("class", "bars");

		this.bars = bars.selectAll(".bar")
			.data(this.data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function (d: any) {
				return x(d.monthName);
			})
			.attr("y", function (d: any) {
				return y(d.avgTime);
			})
			.attr("width", x.bandwidth())
			.attr("height", function (d: any) {
				return height - y(d.avgTime);
			})

		this.bars
			.on('mousemove',  function  (s)  {               
				this.tooltip          .style('top',   (d3.event.layerY  +  15)  +  'px')          .style('left',   (d3.event.layerX)  +  'px')          .style('display',  'block')          .style('opacity',  1)          .style('height',  'auto')          .html('Month: '  +  s.monthName +  '<br>'  +             'Average Time: '  + s.avgTime.toFixed(2));      
			}.bind(this))      .on('mouseover',  function  (data,  i,  arr)  {        
				const  interval  =  3;

				        
				d3.select(arr[i])          .transition()          .ease(d3.easeBounce)          .duration(150)          .attr('fill',  '#09babb')          .attr('x',  d => x(d['monthName']))          .attr('width',  x.bandwidth())          .attr('y',  d => y(d['avgTime']))          .attr('height',  d => 345 - y(d['avgTime']));

				            
			}.bind(this))      .on('mouseout',  function  (data,  i,  arr)  {        
				this.tooltip.style('display',  'none');        
				this.tooltip.style('opacity',  0);

				        
				d3.select(arr[i])          .transition()          .ease(d3.easeBounce)          .duration(150)          .attr('fill',  '#00EEF0')          .attr('x',  d => x(d['monthName']))          .attr('width',  x.bandwidth())          .attr('y',  d => y(d['avgTime']))          .attr('height',  d => 345 - y(d['avgTime']));      
			}.bind(this));


		var average = averagetime ? averagetime : 0;

		var line = d3.line()
			.x(function (d: any, i) {
				return x2(d.monthName) + i;
			})
			.y(function (d: any, i) {
				return y(average);
			});

		svg.append("path")
			.datum(this.data)
			.attr("class", "mean")
			.attr("d", function (d: any) {
				return line(d)
			});

		svg.append("text")
			.attr("transform", "translate(" + (element.offsetWidth - 100) + "," + y(average) + ")")
			.attr("dy", "1em")
			.attr("text-anchor", "end")
			.style("fill", "#f07867")
			.html(average);
	}

	onResize(event) {
		this.createChart();
	}

}