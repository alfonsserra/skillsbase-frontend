import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, ChartItem } from 'systelab-charts/widgets/chart/chart.component';
import { OrganizationSummary } from '../../shared/model/organization-summary';

@Component({
  selector:    'summary',
  templateUrl: 'summary.component.html'
})
export class SummaryComponent implements OnChanges {

  @ViewChild('chart') chart: ChartComponent;

  @Input() data: OrganizationSummary;

  public dataBubble: Array<ChartItem> = [];
  public legend: boolean;
  public labels: Array<string> = [];

  constructor() {
    this.legend = false;
    this.labels = [];

  }

  public ngOnChanges() {
    if (this.data) {
      for (let i = 0; i < this.data.topTenByProficiency.length; i++) {
        const interest = this.getInterestForSkill(this.data.topTenByProficiency[i].id);
        this.dataBubble.push(new ChartItem(this.data.topTenByProficiency[i].text, [{
          x: this.data.topTenByProficiency[i].rate,
          y: interest,
          r: 4
        }], '', '', true, false, false, 2));

      }
    }
    if (this.chart) {
      try {
        this.chart.doUpdate();
      } catch (ex) {}
    }
  }

  private getInterestForSkill(id: number) {
    if (this.data) {
      for (let i = 0; i < this.data.topTenByInterest.length; i++) {
        if (this.data.topTenByInterest[i].id === id) {
          return this.data.topTenByInterest[i].rate;
        }
      }
    }
    return 0;
  }

  public getProficiency() {
    return this.data ? Math.round(this.data.proficiency * 10) : 0;
  }

  public getInterest() {
    return this.data ? Math.round(this.data.interest * 10) : 0;
  }
}
