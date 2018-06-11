import { Injectable } from '@angular/core';
import { Skill } from '../shared/model/skill';
import { SkillAssessment } from '../shared/model/skill-assessment';
import { AssessmentService } from '../shared/api/assessment.service';
import { SkillService } from '../shared/api/skill.service';
import { SummaryService } from '../shared/api/summary.service';
import { Observable } from 'rxjs/Rx';
import { OrganizationSummary } from '../shared/model/organization-summary';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class SkillsTreeService {

  constructor(protected assessmentService: AssessmentService, protected skillService: SkillService, protected summaryService: SummaryService) {

  }

  public initSkill(startingSkill: Skill) {
    startingSkill.proficiency = 0;
    startingSkill.interest = 0;

    if (startingSkill.children) {
      for (let i = 0; i < startingSkill.children.length; i++) {
        this.initSkill(startingSkill.children[i]);
      }
    }
  }

  private setSkill(startingSkill: Skill, id: number, proficiency: number, interest: number, individual: boolean): boolean {
    if (startingSkill.id === id) {
      if (individual) {
        if (proficiency) {
          startingSkill.proficiency = proficiency;
        }
        if (interest) {
          startingSkill.interest = interest;
        }
      } else {
        if (proficiency) {
          startingSkill.averageProficiency = proficiency;
        }
        if (interest) {
          startingSkill.averageInterest = interest;
        }
      }
      return true;
    } else {
      if (startingSkill.children) {
        for (let i = 0; i < startingSkill.children.length; i++) {
          if (this.setSkill(startingSkill.children[i], id, proficiency, interest, individual)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public loadUserAssessment(startingSkill: Skill) {
    this.assessmentService.getUserAssessment()
      .subscribe(
        (myAssessment: Array<SkillAssessment>) => {
          for (let i = 0; i < myAssessment.length; i++) {
            this.setSkill(startingSkill, myAssessment[i].id.skillId, myAssessment[i].proficiency, myAssessment[i].interest, true);
          }
        });
  }

  public loadOrganizationSummary(startingSkill: Skill): Observable<OrganizationSummary> {
    return this.summaryService.getOrganizationSummary()
      .pipe(
        map(
          (organizationSummary) => {
            if (organizationSummary.topTenByProficiency) {
              for (let i = 0; i < organizationSummary.topTenByProficiency.length; i++) {
                this.setSkill(startingSkill, organizationSummary.topTenByProficiency[i].id, organizationSummary.topTenByProficiency[i].rate, undefined, false);
              }
            }
            if (organizationSummary.topTenByInterest) {
              for (let i = 0; i < organizationSummary.topTenByInterest.length; i++) {
                this.setSkill(startingSkill, organizationSummary.topTenByInterest[i].id, undefined, organizationSummary.topTenByInterest[i].rate, false);
              }
            }
            return organizationSummary;
          }
        ));
  }

}
