import { Component, Input, OnInit } from '@angular/core';
import { ChartItem } from 'systelab-charts/widgets/chart/chart.component';
import { OrganizationSummary } from '../../shared/model/organization-summary';

@Component({
  selector:    'summary',
  templateUrl: 'summary.component.html'
})
export class SummaryComponent implements OnInit {

  @Input() data: OrganizationSummary;

  public dataBubble: Array<ChartItem> = [];
  public legend: boolean;
  public labels: Array<string> = [];

  constructor() {
    this.legend = false;
    this.labels = [];

    this.dataBubble.push(new ChartItem('Test 1', [{x: 4, y: 6, r: 4, t: 'Tooltip'}], '', '', true, false, false, 2));
    this.dataBubble.push(new ChartItem('Test 2', [{x: 2, y: 9, r: 4, t: 'Tooltip'}], '', '', true, false, false, 2));
    this.dataBubble.push(new ChartItem('Test 3', [{x: 3, y: 6, r: 4, t: 'Tooltip'}], '', '', true, false, false, 2));
    this.dataBubble.push(new ChartItem('Test 4', [{x: 6, y: 2, r: 4, t: 'Tooltip'}], '', '', true, false, false, 2));
    this.dataBubble.push(new ChartItem('Test 5', [{x: 1, y: 6, r: 4, t: 'Tooltip'}], '', '', true, false, false, 2));
  }

  public ngOnInit() {

  }


  public getProficiency() {
    return this.data ? Math.round(this.data.proficiency * 10) : 0;
  }

  public getInterest() {
    return this.data ? Math.round(this.data.interest * 10) : 0;
  }
}
