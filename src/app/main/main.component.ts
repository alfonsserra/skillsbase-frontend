import { Component, OnInit, ViewChild } from '@angular/core';
import { I18nService } from 'systelab-translate/lib/i18n.service';
import { Router } from '@angular/router';
import { MessagePopupService } from 'systelab-components/widgets/modal/message-popup/message-popup.service';
import { SkillService } from '../shared/api/skill.service';
import { Skill } from '../shared/model/skill';
import { AssessmentService } from '../shared/api/assessment.service';
import { CompareComponent } from './compare/compare.component';
import { NavbarItem } from 'systelab-components/widgets/navbar/navbar.component';
import { timer } from 'rxjs/index';
import { SummaryService } from '../shared/api/summary.service';
import { OrganizationSummary } from '../shared/model/organization-summary';
import { TopUsersComponent } from './top-users/top-users.component';
import { SkillsTreeService } from './skills-tree.service';

@Component({
	selector:    'main',
	templateUrl: 'main.component.html',
	styleUrls:   ['main.component.scss']
})
export class MainComponent implements OnInit {

	@ViewChild('compare') compare: CompareComponent;
	@ViewChild('topusers') topusers: TopUsersComponent;

	selectedMenuId = 'ms';

	public isSideBarVisible = true;
	public currentNav = 0;

	public topSkill: Skill;
	public currentSkill: Skill;
	public organizationSummary: OrganizationSummary;
	public itemsNav: NavbarItem[] = [];

	constructor(private router: Router, protected messagePopupService: MessagePopupService,
	            protected i18nService: I18nService, protected skillsTreeService: SkillsTreeService,
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
					this.skillsTreeService.initSkill(this.topSkill);
					this.skillsTreeService.loadUserAssessment(this.topSkill);
					this.skillsTreeService.loadOrganizationSummary(this.topSkill)
						.subscribe(
							(sm) => this.organizationSummary = sm
						);
				}
			);
	}

	public skillSelected(skill: Skill) {
		this.currentSkill = skill;
		if (this.compare) {
			this.compare.doUpdate(skill);
		}
		if (this.topusers) {
			this.topusers.doUpdate(skill);
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
