import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, ChartItem } from 'systelab-charts/widgets/chart/chart.component';
import { Skill } from '../../shared/model/skill';
import { timer } from 'rxjs';

@Component({
  selector:    'compare',
  templateUrl: 'compare.component.html'
})
export class CompareComponent implements OnInit {

  public dataBar1: Array<ChartItem> = [];
  public dataBar2: Array<ChartItem> = [];
  public legend: boolean;
  public labels: Array<string> = [];

  @ViewChild('chart1') chart1: ChartComponent;
  @ViewChild('chart2') chart2: ChartComponent;

  constructor() {
    this.legend = true;
  }

  public ngOnInit() {
  }

  private initChart(skill: Skill) {

    this.labels = [];
    this.dataBar1 = [];
    this.dataBar2 = [];

    if (skill.children) {
      this.fillLabels(skill);
      this.fillProficiency(skill);
      this.fillInterest(skill);
    }

    timer(200)
      .subscribe(
        () => {


          this.chart1.doUpdate();
          this.chart2.doUpdate();
        }
      );
  }

  public fillLabels(skill: Skill) {
    for (let i = 0; i < skill.children.length; i++) {
      this.labels.push(skill.children[i].text);
    }
  }

  public fillProficiency(skill: Skill) {
    let me = [];
    let organization = [];

    for (let i = 0; i < skill.children.length; i++) {
      me.push(skill.children[i].proficiency);
      organization.push(skill.children[i].averageProficiency);
    }
    this.dataBar1.push(new ChartItem('Me', me, '', '', false, true, false, 3));
    this.dataBar1.push(new ChartItem('Organization', organization, '', '', true, true, false, 3));
  }

  public fillInterest(skill: Skill) {
    let me = [];
    let organization = [];

    for (let i = 0; i < skill.children.length; i++) {
      me.push(skill.children[i].interest);
      organization.push(skill.children[i].averageInterest);
    }
    this.dataBar2.push(new ChartItem('Me', me, '', '', false, true, false, 3));
    this.dataBar2.push(new ChartItem('Organization', organization, '', '', true, true, false, 3));
  }

  public doUpdate(skill: Skill) {
    this.initChart(skill);
  }
}
