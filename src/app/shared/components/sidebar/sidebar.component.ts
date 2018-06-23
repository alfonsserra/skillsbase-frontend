import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Skill } from '../../model/skill';

@Component({
	selector:    'sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls:   ['sidebar.component.scss']
})
export class SideBarComponent {
	@Input() public selectedMenuId = 'ms';
	@Output() public selectedMenuIdChange = new EventEmitter<string>();
	public level = 0;

	@Output() public skillSelected = new EventEmitter<object>();
	@Input() public topSkill: Skill;
	@Input() public isVisible: true;

	public select(selectMenuItem, skill: Skill) {
		let optionSelected = '';
		if (skill) {
			optionSelected = selectMenuItem + skill.id;
		} else {
			optionSelected = selectMenuItem;
		}
		this.selectedMenuIdChange.emit(optionSelected);
		this.skillSelected.emit(skill);
	}

}
