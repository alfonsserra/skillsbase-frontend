import { Component, Input } from '@angular/core';
import { ChartItem } from 'systelab-charts/widgets/chart/chart.component';
import { OrganizationSummary } from '../../shared/model/organization-summary';

@Component({
  selector:    'summary',
  templateUrl: 'summary.component.html'
})
export class SummaryComponent {

  @Input() data: OrganizationSummary;

  public dataBubble: Array<ChartItem> = [];
  public legend: boolean;
  public labels: Array<string> = [];

  constructor() {
    this.legend = false;
    this.labels = ['January', 'February', 'March', 'April'];

    this.dataBubble.push(new ChartItem('Test 1', [{x: 13, y: 13, r: 4, t: 'Tooltip'}, {x: 1, y: 2, r: 3}, {x: 15, y: 23, r: 4},
      {x: -2, y: -2, r: 4}, {x: -10, y: 13, r: 3}, {x: 23, y: 12, r: 7}, {x: 4, y: 4, r: 8},
      {x: 3, y: 2, r: 9}], '', '', true, false, false, 2));
    this.dataBubble.push(new ChartItem('Test 2', [{x: 6, y: -2, r: 4}, {x: 2, y: 5, r: 3}, {x: 12, y: 11, r: 4}, {x: 5, y: 10, r: 4},
      {x: 10, y: 46, r: 3}, {x: 16, y: 24, r: 7}, {x: 37, y: 6, r: 8}, {x: 5, y: 3, r: 9}], '', '', true, false, false, 2));
  }

  public getProficiency() {
    return this.data ? Math.round(this.data.proficiency * 10) : 0;
  }

  public getInterest() {
    return this.data ? Math.round(this.data.interest * 10) : 0;
  }
}
