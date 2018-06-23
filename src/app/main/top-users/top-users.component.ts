import { Component, Input, OnInit } from '@angular/core';
import { SummaryService } from '../../shared/api/summary.service';
import { UserRateSummary } from '../../shared/model/user-rate-summary';
import { Skill } from '../../shared/model/skill';

export class SubSkill {
  constructor(public skill: Skill, public data: UserRateSummary) {

  }
}

@Component({
  selector:    'top-users',
  templateUrl: 'top-users.component.html'
})
export class TopUsersComponent implements OnInit {

  @Input() public skill: Skill;

  public skillsList = [];

  constructor(protected summaryService: SummaryService) {
  }

  public ngOnInit() {
    this.loadTopUsers();
  }

  public doUpdate(skill: Skill) {
    this.skill = skill;
    this.loadTopUsers();
  }

  private loadTopUsers() {
    this.skillsList = [];
    if (this.skill.id) {
      this.summaryService.getUserRateSummary(this.skill.id)
        .subscribe(userRateSummary =>
          this.skillsList.unshift(new SubSkill(this.skill, userRateSummary)));
      for (const skill of this.skill.children) {
        this.summaryService.getUserRateSummary(skill.id)
          .subscribe(userRateSummary => {
            if (userRateSummary.topTenByProficiency.length > 0 || userRateSummary.topTenByInterest.length > 0) {
              this.skillsList.push(new SubSkill(skill, userRateSummary));
            }
          });
      }
    }
  }
}
