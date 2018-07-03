import { Component, Input, ViewChild } from '@angular/core';
import { ChartComponent, ChartItem } from 'systelab-charts/widgets/chart/chart.component';
import { OrganizationSummary } from '../../shared/model/organization-summary';
import { Skill } from '../../shared/model/skill';
import { SkillsTreeService } from '../skills-tree.service';
import { timer } from 'rxjs/index';

@Component({
	selector:    'skills-map',
	templateUrl: 'skills-map.component.html'
})
export class SkillsMapComponent {

	@ViewChild('chart') chart: ChartComponent;

	@Input() data: OrganizationSummary;

	public dataBubble: Array<ChartItem> = [];
	public legend: boolean;
	public labels: Array<string> = [];

	constructor(protected skillsTreeService: SkillsTreeService) {
		this.legend = false;
		this.labels = [];

	}

	public doUpdate(skill: Skill) {
		this.dataBubble = [];
		this.labels = [];

		if (this.data) {
			for (let i = 0; i < this.data.topTenByProficiency.length; i++) {
				if (this.skillsTreeService.isSkillDescendantOf(skill, this.data.topTenByProficiency[i].id)) {

					const interest = this.getInterestForSkill(this.data.topTenByProficiency[i].id);
					this.dataBubble.push(new ChartItem(this.data.topTenByProficiency[i].text, [{
						x: this.data.topTenByProficiency[i].rate,
						y: interest,
						r: 4
					}], '', '', true, false, false, 2));
				}
			}
		}

		timer(200)
			.subscribe(
				() => {
					if (this.chart) {
						try {
							this.chart.doUpdate();
						} catch (ex) {
						}
					}
				});
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
}
