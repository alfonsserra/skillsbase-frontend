import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Skill } from '../../model/skill';

@Component({
  selector:    'sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls:   ['sidebar.component.scss']
})
export class SideBarComponent {
  public selectedMenuId = 'ms';

  public level = 0;

  @Output() public skillSelected = new EventEmitter<Skill>();
  @Input() public topSkill: Skill;
  @Input() public isVisible: true;

  public select(skill: Skill) {
    if (!skill) {
      this.selectedMenuId = 'ms';
    }
    else {
      this.selectedMenuId = 'it' + skill.id;
    }
    this.skillSelected.emit(skill);
  }

}
