import { Injectable } from '@angular/core';
import { Skill } from '../shared/model/skill';
import { SkillAssessment } from '../shared/model/skill-assessment';
import { AssessmentService } from '../shared/api/assessment.service';
import { SkillService } from '../shared/api/skill.service';
import { SummaryService } from '../shared/api/summary.service';
import { Observable } from 'rxjs/Rx';
import { OrganizationSummary } from '../shared/model/organization-summary';
import { map } from 'rxjs/internal/operators';
import { SkillToImprovement } from '../shared/model/skill-improvement';
import { SkillSummary } from '../shared/model/skillSummary';

@Injectable({
	providedIn: 'root'
})
export class SkillsTreeService {

	constructor(protected assessmentService: AssessmentService, protected skillService: SkillService, protected summaryService: SummaryService) {

	}

	public initSkill(startingSkill: Skill) {
		startingSkill.isProficiencyAssessed = false;
		startingSkill.isInterestAssessed = false;
		startingSkill.proficiency = 0;
		startingSkill.interest = 0;

		if (startingSkill.children) {
			startingSkill.children.forEach((skill) => this.initSkill(skill));
		}
	}

	public setProficiencyAndInterestToZero(startingSkill: Skill) {

		const assessments = this.getSkillAssessmentListFromRoot(startingSkill, (s: Skill) => !s.isProficiencyAssessed || !s.isProficiencyAssessed);
		if (assessments.length > 0) {
			assessments.forEach(assessment => {
				if (assessment.interest === undefined) {
					assessment.interest = 0;
				}
				if (assessment.proficiency === undefined) {
					assessment.proficiency = 0;
				}
			});

			this.assessmentService.saveUserAssessment(assessments)
				.subscribe(
					(savedAssessments) => {
						for (let i = 0; i < savedAssessments.length; i++) {
							this.setSkill(startingSkill, savedAssessments[i].id.skillId, savedAssessments[i].proficiency, savedAssessments[i].interest, true);
						}
					}
				);
		}
	}

	public setInterestEqualsToProficiency(startingSkill: Skill) {

		const assessments = this.getSkillAssessmentListFromRoot(startingSkill, (s: Skill) => s.isProficiencyAssessed && s.proficiency !== s.interest);
		if (assessments.length > 0) {

			assessments.forEach(assessment => assessment.interest = assessment.proficiency);
			this.assessmentService.saveUserAssessment(assessments)
				.subscribe(
					(savedAssessments) => {
						for (let i = 0; i < savedAssessments.length; i++) {
							this.setSkill(startingSkill, savedAssessments[i].id.skillId, savedAssessments[i].proficiency, savedAssessments[i].interest, true);
						}
					}
				);
		}
	}

	public getSkillAssessmentListFromRoot(startingSkill: Skill, filter: (s: Skill) => boolean): Array<SkillAssessment> {
		let skills = new Array<SkillAssessment>();

		let proficiency: number;
		let interest: number;

		if (startingSkill.isProficiencyAssessed) {
			proficiency = startingSkill.proficiency;
		}
		if (startingSkill.isInterestAssessed) {
			interest = startingSkill.interest;
		}
		if (filter(startingSkill)) {

			skills.push({
				id:          {
					skillId: startingSkill.id,
					userId:  0
				},
				proficiency: proficiency,
				interest:    interest
			});
		}
		if (startingSkill.children) {
			for (let i = 0; i < startingSkill.children.length; i++) {
				skills = skills.concat(this.getSkillAssessmentListFromRoot(startingSkill.children[i], filter));
			}
		}
		return skills;
	}

	public getNumberOfSkills(startingSkill: Skill, onlyAssessed = false): number {

		let total = 1;
		if (onlyAssessed) {
			if (startingSkill.isProficiencyAssessed && startingSkill.isInterestAssessed) {
				total = 1;
			} else {
				total = 0;
			}
		}
		if (startingSkill.children) {
			for (let i = 0; i < startingSkill.children.length; i++) {
				total += this.getNumberOfSkills(startingSkill.children[i], onlyAssessed);
			}
		}
		return total;
	}

	private setSkill(startingSkill: Skill, id: number, proficiency: number, interest: number, individual: boolean): boolean {
		if (startingSkill.id === id) {
			if (individual) {
				if (proficiency !== undefined) {
					startingSkill.proficiency = proficiency;
					startingSkill.isProficiencyAssessed = true;
				}
				if (interest !== undefined) {
					startingSkill.interest = interest;
					startingSkill.isInterestAssessed = true;
				}
			} else {
				if (proficiency) {
					startingSkill.averageProficiency = proficiency;
				}
				if (interest) {
					startingSkill.averageInterest = interest;
				}
			}
			return true;
		} else {
			if (startingSkill.children) {
				for (let i = 0; i < startingSkill.children.length; i++) {
					if (this.setSkill(startingSkill.children[i], id, proficiency, interest, individual)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public loadUserAssessment(startingSkill: Skill) {
		this.assessmentService.getUserAssessment()
			.subscribe(
				(myAssessment: Array<SkillAssessment>) => {
					for (let i = 0; i < myAssessment.length; i++) {
						this.setSkill(startingSkill, myAssessment[i].id.skillId, myAssessment[i].proficiency, myAssessment[i].interest, true);
					}
				});
	}

	public loadOrganizationSummary(startingSkill: Skill): Observable<OrganizationSummary> {
		return this.summaryService.getOrganizationSummary()
			.pipe(
				map(
					(organizationSummary) => {
						if (organizationSummary.topTenByProficiency) {
							for (let i = 0; i < organizationSummary.topTenByProficiency.length; i++) {
								this.setSkill(startingSkill, organizationSummary.topTenByProficiency[i].id, organizationSummary.topTenByProficiency[i].rate, undefined, false);
							}
						}
						if (organizationSummary.topTenByInterest) {
							for (let i = 0; i < organizationSummary.topTenByInterest.length; i++) {
								this.setSkill(startingSkill, organizationSummary.topTenByInterest[i].id, undefined, organizationSummary.topTenByInterest[i].rate, false);
							}
						}
						return organizationSummary;
					}
				));
	}

	public getSkillsKeenToImprove(startingSkill: Skill): Array<SkillToImprovement> {
		let skills = new Array<SkillToImprovement>();
		if (startingSkill.interest > startingSkill.proficiency) {
			skills.push({
				text:        startingSkill.text,
				current:     startingSkill.proficiency,
				improvement: (startingSkill.interest - startingSkill.proficiency)
			});
		}
		if (startingSkill.children) {
			for (let i = 0; i < startingSkill.children.length; i++) {
				skills = skills.concat(this.getSkillsKeenToImprove(startingSkill.children[i]));
			}
		}
		return skills;
	}

	public getMySkillsSummary(startingSkill: Skill, isProficiency: boolean): Array<SkillSummary> {
		let skills = new Array<SkillSummary>();
		if (isProficiency && startingSkill.isProficiencyAssessed) {
			skills.push({
				id:   startingSkill.id,
				text: startingSkill.text,
				rate: Number(startingSkill.proficiency)
			});
		}
		if (!isProficiency && startingSkill.isInterestAssessed) {
			skills.push({
				id:   startingSkill.id,
				text: startingSkill.text,
				rate: Number(startingSkill.interest)
			});
		}
		if (startingSkill.children) {
			for (let i = 0; i < startingSkill.children.length; i++) {
				skills = skills.concat(this.getMySkillsSummary(startingSkill.children[i], isProficiency));
			}
		}
		return skills;
	}

}
