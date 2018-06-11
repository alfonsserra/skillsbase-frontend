import { Component, OnInit, ViewChild } from '@angular/core';
import { I18nService } from 'systelab-translate/lib/i18n.service';
import { Router } from '@angular/router';
import { MessagePopupService } from 'systelab-components/widgets/modal/message-popup/message-popup.service';
import { SkillService } from '../shared/api/skill.service';
import { Skill } from '../shared/model/skill';
import { AssessmentService } from '../shared/api/assessment.service';
import { SkillAssessment } from '../shared/model/skill-assessment';
import { CompareComponent } from './compare/compare.component';
import { NavbarItem } from 'systelab-components/widgets/navbar/navbar.component';
import { timer } from 'rxjs/index';
import { SummaryService } from '../shared/api/summary.service';
import { OrganizationSummary } from '../shared/model/organization-summary';
import { TopUsersComponent } from './top-users/top-users.component';

@Component({
  selector:    'main',
  templateUrl: 'main.component.html',
  styleUrls:   ['main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('compare') compare: CompareComponent;
  @ViewChild('topusers') topusers: TopUsersComponent;

  public isSideBarVisible = true;
  public currentNav = 0;

  public topSkill: Skill;
  public currentSkill: Skill;
  public organizationSummary: OrganizationSummary;
  public itemsNav: NavbarItem[] = [];

  constructor(private router: Router, protected messagePopupService: MessagePopupService,
              protected i18nService: I18nService,
              protected assessmentService: AssessmentService, protected skillService: SkillService, protected summaryService: SummaryService) {
  }

  public ngOnInit() {

    this.itemsNav.push(new NavbarItem(0, 'Assessment', '', false, true, true, () => this.selectNav(0)));
    this.itemsNav.push(new NavbarItem(1, 'Organization', '', false, false, true, () => this.selectNav(1)));
    this.itemsNav.push(new NavbarItem(2, 'Top ten', '', false, false, true, () => this.selectNav(2)));
    this.loadTree();
  }

  private loadTree() {
    this.skillService.getCategory(0)
      .subscribe(
        (skill) => {
          this.topSkill = skill;
          this.initSkill(this.topSkill);
          this.loadUserAssessment();
          this.loadOrganizationSummary();
        }
      );
  }

  private loadUserAssessment() {
    this.assessmentService.getUserAssessment()
      .subscribe(
        (myAssessment: Array<SkillAssessment>) => {
          for (let i = 0; i < myAssessment.length; i++) {
            this.setSkill(this.topSkill, myAssessment[i].id.skillId, myAssessment[i].proficiency, myAssessment[i].interest, true);
          }
        });
  }

  private loadOrganizationSummary() {
    this.summaryService.getOrganizationSummary()
      .subscribe(
        (organizationSummary) => {
          this.organizationSummary=organizationSummary;
          if (organizationSummary.topTenByProficiency) {
            for (let i = 0; i < organizationSummary.topTenByProficiency.length; i++) {
              this.setSkill(this.topSkill, organizationSummary.topTenByProficiency[i].id, organizationSummary.topTenByProficiency[i].rate, undefined, false);
            }
          }
          if (organizationSummary.topTenByInterest) {
            for (let i = 0; i < organizationSummary.topTenByInterest.length; i++) {
              this.setSkill(this.topSkill, organizationSummary.topTenByInterest[i].id, undefined, organizationSummary.topTenByInterest[i].rate, false);
            }
          }
        }
      );
  }

  private initSkill(startingSkill: Skill) {
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

  public skillSelected(skill: Skill) {
    this.currentSkill = skill;
    if (this.compare) {
      this.compare.doUpdate(skill);
    }
    if (this.topusers) {
      this.topusers.doUpdate(skill.id);
    }
  }

  public selectNav(navNum: number) {
    this.currentNav = navNum;
    this.itemsNav[navNum].isSelected = true;
    for (let i = 0; i < this.itemsNav.length; i++) {
      if (this.itemsNav[i].id !== navNum) {
        this.itemsNav[i].isSelected = false;
      }
    }
    timer(200)
      .subscribe(
        () => {
          if (this.compare) {
            this.compare.doUpdate(this.currentSkill);
          }
        }
      );
  }

  public doToggleSideBarVisibility() {
    this.isSideBarVisible = !this.isSideBarVisible;
  }

}
