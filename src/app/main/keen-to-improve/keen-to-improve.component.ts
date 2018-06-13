import { Component, Input, OnInit } from '@angular/core';
import { SkillsTreeService } from '../skills-tree.service';
import { Skill } from '../../shared/model/skill';
import { SkillToImprovement } from '../../shared/model/skill-improvement';

@Component({
  selector:    'keen-to-improve',
  templateUrl: 'keen-to-improve.component.html'
})
export class KeenToImproveComponent implements OnInit {

  @Input() public skill: Skill;

  public skillsToImprove: Array<SkillToImprovement> = [];

  constructor(protected skillsTreeService: SkillsTreeService) {
  }

  public ngOnInit() {
    this.skillsToImprove = this.skillsTreeService.getSkillsKeenToImprove(this.skill)
      .sort((a, b) => {
        if (a.improvement > b.improvement) {
          return -1;
        }
        if (a.improvement < b.improvement) {
          return 1;
        }
        return 0;
      });
  }
}
