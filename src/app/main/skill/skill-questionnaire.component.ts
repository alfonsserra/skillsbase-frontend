import { Component, HostListener, Inject, Input } from '@angular/core';
import { Skill } from '../../shared/model/skill';
import { AssessmentService } from '../../shared/api/assessment.service';
import { SkillAssessment } from '../../shared/model/skill-assessment';
import { SkillsTreeService } from '../skills-tree.service';

@Component({
	selector:    'skill-questionnaire',
	templateUrl: 'skill-questionnaire.component.html',
	styleUrls:   ['skill-questionnaire.component.scss']
})
export class SkillQuestionnaireComponent {

	@Input() public skill: Skill;
	@Input() public level = 1;
	public collapsed = false;

	constructor(protected assessmentService: AssessmentService, protected skillsTreeService: SkillsTreeService) {

	}

	public toggleCollapsed() {
		this.collapsed = !this.collapsed;
	}

	public changeProficiencySlider(s: Skill) {
		const skillassessment: SkillAssessment = {
			interest:    Number(s.interest),
			proficiency: Number(s.proficiency),
			id:          {
				skillId: s.id
			}
		};

		this.assessmentService.saveUserSkillAssessment(skillassessment)
			.subscribe(
				(next) => {
					console.log('proficiency set to ' + s.proficiency);
					s.isProficiencyAssessed = true;
				});
	}

	public changeInterestSlider(s: Skill) {
		const skillassessment: SkillAssessment = {
			interest:    Number(s.interest),
			proficiency: Number(s.proficiency),
			id:          {
				skillId: s.id
			}
		};

		this.assessmentService.saveUserSkillAssessment(skillassessment)
			.subscribe(
				(next) => {
					console.log('interest set to ' + s.interest);
					s.isInterestAssessed = true;
				});
	}

	public setFullCategoryToZero() {
		this.skillsTreeService.setProficiencyAndInterestToZero(this.skill)
	}

}
