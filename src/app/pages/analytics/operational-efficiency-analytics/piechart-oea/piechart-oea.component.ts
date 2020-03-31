import {
	Component,
	OnInit,
	ViewEncapsulation,
	ViewChild,
	ElementRef,
	Input
} from '@angular/core';
//import { Item, DataService } from '../data.service';
import * as d3 from 'd3';
export interface DataModel {
	name: string;
	value: number;
	abs: number;
}
@Component({
	selector: 'ngx-piechart-oea',
	templateUrl: './piechart-oea.component.html',
	styleUrls: ['./piechart-oea.component.scss']
})
export class PiechartOeaComponent implements OnInit {

	@Input()
	sucessdeliveries: any;

	@ViewChild('piechart', {
		static: true
	})
	private chartContainer: ElementRef;
	// Dimensions
	get height(): number {
		const element = this.chartContainer.nativeElement;
		return 346
	}
	get width(): number {
		const element = this.chartContainer.nativeElement;
		return element.offsetWidth;
	}
	radius: number;

	// Arcs & pie
	private arc: any;
	private hoveredArc: any;
	private arcLabel: any;
	private pie: any;
	private slices: any;

	private color: any;

	// Drawing containers
	private svg: any;
	private mainContainer: any;

	private texts: any;

	dataSource: DataModel[];
	total: number;
	data1: any;
	element: any;
	divNode: any

	constructor() {

	}
	private tooltip: any;
	ngOnInit() {
		this.element = this.chartContainer.nativeElement;
		//this.initSvg();

	}
	ngOnChanges() {
		//console.log("this.sucessdeliveries",this.sucessdeliveries);
		d3.select(this.element).select('svg').remove();
		if (this.sucessdeliveries && this.sucessdeliveries.status && this.sucessdeliveries.chartData.length == 0) {
			return;
		}
		if (this.sucessdeliveries && this.sucessdeliveries.chartData == undefined) {
			return;
		}

		this.initSvg();
	};
	private initSvg() {


		let data = this.sucessdeliveries.chartData;
		var keys = ['Successful Deliveries', 'Unsucessful Deliveries'];
		var width = 1000,
			height = 200,
			radius = Math.min(width, height) / 2;
		this.divNode = d3.select(this.element).node();
		var outerRadius = radius - 10,
			innerRadius = radius - 80;
		this.color = d3.scaleOrdinal()
			.range(["#9bf067", "#f07867"]);

		this.arc = d3.arc()
			.outerRadius(radius - 5)
			.innerRadius(radius - 40);

		var pie = d3.pie()
			.sort(null)
			.value(function (d: any) {
				return d.percent;
			});

		d3.select(this.element).append("svg")
			.attr("id", "mainPie")
			.attr("class", "pieBox")
			.attr("width", width)
			.attr("height", 345);

		var svg = d3.select("#mainPie").append("svg")
			.attr("width", width)
			.attr("height", 345)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


		var tooltip = d3.select(this.element).append('div');
		tooltip.attr("class", "piecharttttooltip");
		tooltip.style("opacity", 0);

		var defs = svg.append("defs");
		var filter = defs.append("filter")
			.attr("id", "drop-shadow")
			.attr("height", "130%");

		filter.append("feGaussianBlur")
			.attr("in", "SourceAlpha")
			.attr("stdDeviation", 3)
			.attr("result", "blur");

		filter.append("feOffset")
			.attr("in", "blur")
			.attr("dx", 3)
			.attr("dy", 3)
			.attr("result", "offsetBlur");
		var feMerge = filter.append("feMerge");

		feMerge.append("feMergeNode")
			.attr("in", "offsetBlur")
		feMerge.append("feMergeNode")
			.attr("in", "SourceGraphic");

		var g = svg.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc");

		g.append("path")
			.attr("d", this.arc)
			.style("fill", (d: any) => {
				//console.log('111111111111',d.data._id)
				{
					if (d.data._id == 'delivered') return "#9bf067";
					else return "#f07867"
				}
				//return this.color(d.data._id)
			})
			.on("mousemove", function (d: any) {
				if (d.data._id == "cancelled") {
					var textname = "Unsucessful Deliveries";
				} else {
					var textname = "Successful Deliveries"
				}
				d3.select(this)
					.attr("stroke", "#fff")
					.attr("stroke-width", "2px")
				tooltip
					.style("left", d3.event.layerX + "px")
					.style("top", d3.event.layerY + 20 + "px")
					.style('opacity', 1)
					.style('height', 100)
					.html('<div >' + textname + '<br/>' + d.data.percent.toFixed(2) + "%<br/> Count: " + d.data.count + '</div>');
			})
			.on("mouseout", function (d: any) {
				d3.select(this)
					.attr("stroke", "none")
					.style("filter", "none");
				d3.select(this)
					.transition()
					.duration(500)
					.attr('transform', 'translate(0,0)');
				tooltip.style('opacity', 0);
			})
		var legend = svg.append("g")
			.attr("font-family", "sans-serif")

			.attr("class", "pie-legend")
			// .attr("font-size", 10)
			.attr("text-anchor", "end")
			.selectAll("g")
			.data(keys.slice().reverse())
			.enter().append("g")
			.attr("transform", function (d, i) {
				return "translate(0," + i * 20 + ")";
			})


		legend.append("rect")
			.attr("x", 600)
			.attr("width", 15)
			.attr("height", 15)
			.attr("fill", function (d: any) {
				if (d == 'Successful Deliveries') return "#9bf067";
				else return "#f07867"
			});

		legend.append("text")
			.attr("x", 590)
			.attr("y", 9.5)
			.attr("dy", "0.32em")
			.text(function (d: any) {
				return d;
			});

		/*
    var legend = svg.selectAll('.legend-entry').data(data)
  .enter().append('g')
    .attr('class', 'legend-entry')

legend.append('rect')
  .attr('class', 'legend-rect')
  .attr('x', 0)
  .attr('y', function (d, i) { return i * 20 })
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill',function(d: any){ 
    if(d._id == "cancelled"){return "#f07867"}else {return "#9bf067"}
   })

legend.append('text')
  .attr('class', 'legend-text')
  .attr('x', 25)
  .attr('y', function (d, i) { return i * 20 })
  .text(function(d: any) {
    if(d._id == "cancelled"){return "Cancelled"}else {return "Delivered"}
  })*/

	}

	private resize() {

	}

	private repaint() {

	}
}