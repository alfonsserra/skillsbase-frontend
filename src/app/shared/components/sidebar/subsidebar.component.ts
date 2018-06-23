import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Skill } from '../../model/skill';

@Component({
	selector:    'subsidebar',
	templateUrl: 'subsidebar.component.html',
	styleUrls:   ['subsidebar.component.scss']
})
export class SubSideBarComponent {
	@Input() public skill: Skill;
	@Input() public level;
	@Output() public skillSelected = new EventEmitter<Skill>();

	@Input() public selectedMenuId;

	public select(skill: Skill) {
		this.skillSelected.emit(skill);
	}

	public isParentOfACategory() {
		if (this.skill.children && this.skill.children.length > 0) {
			for (let s of this.skill.children) {
				if (s.type === 'category') {
					return true;
				}
			}
		}
		return false;
	}

}
