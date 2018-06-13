import { Component, Input } from '@angular/core';
import { SkillToImprovement } from '../../model/skill-improvement';

@Component({
  selector:    'skills-to-improve-table',
  templateUrl: 'skills-to-improve-table.component.html',
  styleUrls:   ['skills-to-improve-table.component.scss']
})
export class SkillsToImproveComponent {

  @Input() public data: Array<SkillToImprovement>;
  @Input() public title;

  constructor() {
  }

}