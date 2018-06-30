import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, ChartItem } from 'systelab-charts/widgets/chart/chart.component';
import { Skill } from '../../shared/model/skill';
import { timer } from 'rxjs';

@Component({
	selector:    'compare',
	templateUrl: 'compare.component.html'
})
export class CompareComponent {

	public dataBarProficiency: Array<ChartItem> = [];
	public dataBarInterest: Array<ChartItem> = [];
	public legend: boolean;
	public labels: Array<string> = [];

	@ViewChild('proficiencyChart') proficiencyChart: ChartComponent;
	@ViewChild('interestChart') interestChart: ChartComponent;

	constructor() {
		this.legend = true;
	}

	private initChart(skill: Skill) {

		this.labels = [];
		this.dataBarProficiency = [];
		this.dataBarInterest = [];

		if (skill.children) {
			this.fillLabels(skill);
			this.fillProficiency(skill);
			this.fillInterest(skill);
		}

		timer(200)
			.subscribe(
				() => {
					this.proficiencyChart.doUpdate();
					this.interestChart.doUpdate();
				}
			);
	}

	private fillLabels(skill: Skill) {
		this.labels = skill.children.map((s: Skill) => s.text);
	}

	private fillProficiency(skill: Skill) {
		const myProficiency = skill.children.map((s: Skill) => s.proficiency);
		const organizationProficiency = skill.children.map((s: Skill) => s.averageProficiency);

		this.dataBarProficiency.push(new ChartItem('Me', myProficiency, '', '', false, true, false, 3));
		this.dataBarProficiency.push(new ChartItem('Organization', organizationProficiency, '', '', true, true, false, 3));
	}

	private fillInterest(skill: Skill) {
		const myInterest = skill.children.map((s: Skill) => s.interest);
		const organizationInterest = skill.children.map((s: Skill) => s.averageInterest);

		this.dataBarInterest.push(new ChartItem('Me', myInterest, '', '', false, true, false, 3));
		this.dataBarInterest.push(new ChartItem('Organization', organizationInterest, '', '', true, true, false, 3));
	}

	public doUpdate(skill: Skill) {
		this.initChart(skill);
	}
}
