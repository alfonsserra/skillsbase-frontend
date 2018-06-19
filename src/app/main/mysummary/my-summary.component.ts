import { Component, Input, OnInit } from '@angular/core';
import { SkillsTreeService } from '../skills-tree.service';
import { Skill } from '../../shared/model/skill';
import { SkillToImprovement } from '../../shared/model/skill-improvement';

@Component({
  selector:    'my-summary',
  templateUrl: 'my-summary.component.html'
})
export class MySummaryComponent implements OnInit {

  @Input() public skill: Skill;

  public skillsToImprove: Array<SkillToImprovement> = [];

  public percentageOfCompletion = 0;

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
    const totalSkills = this.skillsTreeService.getNumberOfSkills(this.skill, false);
    const assessedSkills = this.skillsTreeService.getNumberOfSkills(this.skill, true);
    this.percentageOfCompletion = (assessedSkills / totalSkills) * 100;
  }
}
