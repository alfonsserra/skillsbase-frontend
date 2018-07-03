import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SkillsTreeService } from '../skills-tree.service';
import { Skill } from '../../shared/model/skill';
import { SkillToImprovement } from '../../shared/model/skill-improvement';
import { SkillSummary } from '../../shared/model/skillSummary';
import { OrganizationSummary } from '../../shared/model/organization-summary';

@Component({
	selector:    'my-summary',
	templateUrl: 'my-summary.component.html'
})
export class MySummaryComponent implements OnChanges {

	@Input() public skill: Skill;
	@Input() public withCounters = true;
	@Input() public withTitle = true;
	@Input() data: OrganizationSummary;

	public skillsToImprove: Array<SkillToImprovement> = [];
	public interest: number;
	public proficiency: number;
	public topTenByInterest: Array<SkillSummary>;
	public topTenByProficiency: Array<SkillSummary>;
	public percentageOfCompletion = 0;

	constructor(protected skillsTreeService: SkillsTreeService) {
	}

	public ngOnChanges() {
		this.loadTopTen();
	}

	public doUpdate(skill: Skill) {
		this.skill = skill;
		this.loadTopTen();
	}

	private loadTopTen() {
		this.setSkillsToImprove(this.skill);
		this.setInterest(this.skill);
		this.setProficiency(this.skill);
		this.setPercentageOfCompletion(this.skill);
	}

	private setPercentageOfCompletion(skill: Skill) {
		const totalSkills = this.skillsTreeService.getNumberOfSkills(skill, false);
		const assessedSkills = this.skillsTreeService.getNumberOfSkills(skill, true);
		this.percentageOfCompletion = Math.round((assessedSkills / totalSkills) * 100);
	}

	private setProficiency(skill: Skill) {
		const skillsSummary = this.skillsTreeService.getMySkillsSummary(skill, true);
		this.topTenByProficiency = skillsSummary
			.sort((a, b) => {
				if (a.rate > b.rate) {
					return -1;
				}
				if (a.rate < b.rate) {
					return 1;
				}
				return 0;
			});
		let totalProficiency: number = 0;
		skillsSummary.forEach((s) => totalProficiency = totalProficiency + s.rate);
		this.proficiency = Math.round(totalProficiency * 20 / skillsSummary.length);
	}

	private setInterest(skill: Skill) {
		const skillsSummary = this.skillsTreeService.getMySkillsSummary(skill, false);

		this.topTenByInterest = skillsSummary.sort((a, b) => {
			if (a.rate > b.rate) {
				return -1;
			}
			if (a.rate < b.rate) {
				return 1;
			}
			return 0;
		});
		let totalInterest = 0;
		skillsSummary.forEach((s) => totalInterest = totalInterest + s.rate);
		this.interest = Math.round(totalInterest * 20 / skillsSummary.length);
	}

	private setSkillsToImprove(skill: Skill) {
		this.skillsToImprove = this.skillsTreeService.getSkillsKeenToImprove(skill)
			.sort((a, b) => {
				if (a.improvement > b.improvement) {
					return -1;
				}
				if (a.improvement < b.improvement) {
					return 1;
				}
				return 0;
			});
	}
}
