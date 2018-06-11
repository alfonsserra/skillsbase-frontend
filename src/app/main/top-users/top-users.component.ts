import { Component, Input, OnInit } from '@angular/core';
import { SummaryService } from '../../shared/api/summary.service';
import { UserRateSummary } from '../../shared/model/user-rate-summary';

@Component({
  selector:    'top-users',
  templateUrl: 'top-users.component.html'
})
export class TopUsersComponent implements OnInit {

  @Input() public skillId: number;

  public data: UserRateSummary;

  constructor(protected summaryService: SummaryService) {
  }

  public ngOnInit() {
    this.summaryService.getUserRateSummary(this.skillId)
      .subscribe(userRateSummary => this.data = userRateSummary);
  }

  public doUpdate(id: number) {
    this.skillId = id;
    this.ngOnInit();
  }
}
