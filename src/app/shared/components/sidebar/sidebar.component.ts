import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Skill } from '../../model/skill';

@Component({
  selector:    'sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls:   ['sidebar.component.scss']
})
export class SideBarComponent {
  public selectedMenuId = 'ms';



  @Output() public skillSelected = new EventEmitter<Skill>();
  @Input() public topSkill: Skill;
  @Input() public isVisible: true;


  public select(skill: Skill, selectedMenuId: string) {
    this.selectedMenuId = selectedMenuId;
    this.skillSelected.emit(skill);
  }

}
