import { Component, Input } from '@angular/core';
import { SkillSummary } from '../../model/skillSummary';

@Component({
  selector:    'skills-table',
  templateUrl: 'skills-table.component.html',
  styleUrls:   ['skills-table.component.scss']
})
export class SkillsTableComponent {

  @Input() public data: Array<SkillSummary>;
  @Input() public title;

  constructor() {
  }

}