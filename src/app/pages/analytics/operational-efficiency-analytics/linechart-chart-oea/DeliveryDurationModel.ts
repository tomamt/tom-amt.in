export class DeliveryDuration

{
    status:boolean;
    chartData:DeliveryDurationChartData[]
    datavalid:boolean;
}

export class DeliveryDurationChartData{
    name:string;
    chartData:DeliveryDurationChartTerminalData[];
}
export class DeliveryDurationChartTerminalData{
    minutes:string;
    time:any;
    avgTime:number
}