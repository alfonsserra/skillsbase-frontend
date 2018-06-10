import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, ChartItem } from 'systelab-charts/widgets/chart/chart.component';
import { Skill } from '../../shared/model/skill';
import { timer } from 'rxjs';

@Component({
  selector:    'compare',
  templateUrl: 'compare.component.html'
})
export class CompareComponent implements OnInit {

  public dataBar: Array<ChartItem> = [];
  public legend: boolean;
  public labels: Array<string> = [];
  public chartType = 'bar';

  @ViewChild('chart') chart: ChartComponent;

  constructor() {
    this.legend = false;
  }

  public ngOnInit() {
  }

  private initChart(skill: Skill) {
    console.log(skill.text);

    this.labels = [];
    this.dataBar = [];
    let me = [];
    let organization = [];

    if (skill.children) {
      for (let i = 0; i < skill.children.length; i++) {
        this.labels.push(skill.children[i].text);
        me.push(skill.children[i].proficiency);
        organization.push(skill.children[i].averageProficiency);
      }
    }
    this.dataBar.push(new ChartItem('Me', me, '', '', true, false, false, 3));
    this.dataBar.push(new ChartItem('Organization', organization, '', '', true, true, false, 3));
    timer(200)
      .subscribe(
        () =>  this.chart.doUpdate()
      );
  }

  public doUpdate(skill: Skill) {
    this.initChart(skill);
  }
}
