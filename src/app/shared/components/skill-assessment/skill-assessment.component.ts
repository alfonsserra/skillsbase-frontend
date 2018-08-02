import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Skill } from '../../model/skill';

@Component({
	selector:    'skill-assessment',
	templateUrl: 'skill-assessment.component.html',
	styleUrls:   ['skill-assessment.component.scss']
})
export class SkillAssessmentComponent {

	@Input() public skill: Skill;
	@Input() public level: number;

	@Output() public proficiencyChange = new EventEmitter<Skill>();
	@Output() public interestChange = new EventEmitter<Skill>();

	constructor() {
	}

	public changeProficiencySlider(s: Skill) {
		this.proficiencyChange.emit(s);
	}

	public changeInterestSlider(s: Skill) {
		this.interestChange.emit(s);
	}
}