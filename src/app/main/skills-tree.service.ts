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

	public initSkill(startingSkill: Skill, parent: number) {
		startingSkill.isProficiencyAssessed = false;
		startingSkill.isInterestAssessed = false;
		startingSkill.proficiency = 0;
		startingSkill.interest = 0;
		startingSkill.parent = parent;

		if (startingSkill.children) {
			startingSkill.children.forEach((skill) => this.initSkill(skill, startingSkill.id));
		}
	}

	public setProficiencyAndInterestToZero(startingSkill: Skill) {

		const assessments: Array<SkillAssessment> = this.getSkillAsListFromRoot(startingSkill)
			.filter((s: Skill) => !s.isProficiencyAssessed || !s.isProficiencyAssessed)
			.map((s: Skill) => {
				return {
					id:          {
						skillId: s.id,
						userId:  0
					},
					proficiency: s.proficiency ? s.proficiency : 0,
					interest:    s.interest ? s.interest : 0
				};
			});

		if (assessments.length > 0) {

			this.assessmentService.saveUserAssessment(assessments)
				.subscribe(
					(savedAssessments) => {
						this.setSkillAssessments(startingSkill, savedAssessments);
					}
				);
		}
	}

	public setInterestEqualsToProficiency(startingSkill: Skill) {

		const assessments: Array<SkillAssessment> = this.getSkillAsListFromRoot(startingSkill)
			.filter((s: Skill) => s.isProficiencyAssessed && s.proficiency !== s.interest)
			.map((s: Skill) => {
				return {
					id:          {
						skillId: s.id,
						userId:  0
					},
					proficiency: s.proficiency,
					interest:    s.proficiency
				};
			});

		if (assessments.length > 0) {
			this.assessmentService.saveUserAssessment(assessments)
				.subscribe(
					(savedAssessments) => {
						this.setSkillAssessments(startingSkill, savedAssessments);
					}
				);
		}
	}

	public getSkillAsListFromRoot(startingSkill: Skill): Array<Skill> {
		let skills = new Array<Skill>();

		skills.push(startingSkill);
		if (startingSkill.children) {
			startingSkill.children.forEach((skill) => skills = skills.concat(this.getSkillAsListFromRoot(skill)));
		}
		return skills;
	}

	public getSkill(startingSkill: Skill, id: number): Skill {
		if (startingSkill.id === id) {
			return startingSkill;
		} else {
			if (startingSkill.children) {
				for (let i = 0; i < startingSkill.children.length; i++) {
					const skill = this.getSkill(startingSkill.children[i], id);
					if (skill !== undefined) {
						return skill;
					}
				}
			}
		}
		return undefined;
	}

	public isSkillDescendantOf(startingSkill: Skill, idToCheck: number) {
		const skills: Array<Skill> = this.getSkillAsListFromRoot(this.getSkill(startingSkill, startingSkill.id));
		for (let i = 0; i < skills.length; i++) {
			if (skills[i].id === idToCheck) {
				return true;
			}
		}
		return false;
	}

	public getNumberOfSkills(startingSkill: Skill, onlyAssessed = false): number {

		let total = 1;
		if (startingSkill) {
			if (onlyAssessed) {
				total = startingSkill.isProficiencyAssessed && startingSkill.isInterestAssessed ? 1 : 0;
			}
			if (startingSkill.children) {
				for (let i = 0; i < startingSkill.children.length; i++) {
					total += this.getNumberOfSkills(startingSkill.children[i], onlyAssessed);
				}
			}
		}
		return total;
	}

	private setSkillAssessments(startingSkill: Skill, assessments: Array<SkillAssessment>) {
		assessments.forEach((assessment: SkillAssessment) => this.setSkill(startingSkill, assessment.id.skillId, assessment.proficiency, assessment.interest, true));

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
		if (startingSkill) {
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
		}
		return skills;
	}

	public getMySkillsSummary(startingSkill: Skill, isProficiency: boolean): Array<SkillSummary> {
		let skills = new Array<SkillSummary>();
		if (startingSkill) {

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
		}
		return skills;
	}

}
