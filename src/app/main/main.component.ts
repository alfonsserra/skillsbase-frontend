import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { MySummaryComponent } from './mysummary/my-summary.component';
import { SkillsMapComponent } from './skills-map/skills-map.component';

@Component({
	selector:    'main',
	templateUrl: 'main.component.html',
	styleUrls:   ['main.component.scss']
})
export class MainComponent implements OnInit {

	@ViewChild('compare') compare: CompareComponent;
	@ViewChild('topusers') topusers: TopUsersComponent;
	@ViewChild('summary') summary: MySummaryComponent;
	@ViewChild('skillsmap') skillsmap: SkillsMapComponent;
	selectedMenuId = 'kti';

	public isSideBarVisible = true;
	public currentNav = 0;

	public topSkill: Skill;
	public currentSkill: Skill;
	public organizationSummary: OrganizationSummary;

	private frameWidth = 0;
	private frameHeight = 0;
	public itemsNav: NavbarItem[] = [];

	constructor(private router: Router, protected messagePopupService: MessagePopupService,
	            protected i18nService: I18nService, protected skillsTreeService: SkillsTreeService,
	            protected assessmentService: AssessmentService, protected skillService: SkillService, protected summaryService: SummaryService) {
		this.frameWidth = (window.innerWidth);
		this.frameHeight = (window.innerHeight);
	}

	public ngOnInit() {
		this.addHeaderMenu();
		this.loadTree();
	}

	private addHeaderMenu(): void {
		this.itemsNav = [];
		this.itemsNav.push(new NavbarItem(0, 'Assessment', 'slab-icon-medium fa fa-exchange nav-icon', false, true, true, () => this.selectNav(0)));
		if (this.frameWidth > 1025) {
			this.itemsNav.push(new NavbarItem(1, 'Results', 'slab-icon-medium fa fa-graduation-cap nav-icon', false, false, true, () => this.selectNav(1)));
			this.itemsNav.push(new NavbarItem(2, 'Organization', 'slab-icon-medium icon-home nav-icon', false, false, true, () => this.selectNav(2)));
		}
		this.itemsNav.push(new NavbarItem(3, 'People', 'slab-icon-medium fa fa-user-o nav-icon', false, false, true, () => this.selectNav(3)));
		this.itemsNav.push(new NavbarItem(4, 'Map', 'slab-icon-medium fa fa-map-o nav-icon', false, false, true, () => this.selectNav(4)));
	}

	private loadTree() {
		this.skillService.getCategory(0)
			.subscribe(
				(skill) => {
					this.topSkill = skill;
					this.skillsTreeService.initSkill(this.topSkill, undefined);
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

		timer(200)
			.subscribe(
				() => {
					if (this.compare) {
						this.compare.doUpdate(skill);
					}
					if (this.topusers) {
						this.topusers.doUpdate(skill);
					}
					if (this.summary) {
						this.summary.doUpdate(skill);
					}
					if (this.skillsmap) {
						this.skillsmap.doUpdate(skill);
					}
				});
	}

	public selectNav(navNum: number) {
		this.currentNav = navNum;
		for (let i = 0; i < this.itemsNav.length; i++) {
			if (this.itemsNav[i].id !== navNum) {
				this.itemsNav[i].isSelected = false;
			}
			else {
				this.itemsNav[i].isSelected = true;

			}
		}
		this.skillSelected(this.currentSkill);
	}

	public doToggleSideBarVisibility() {
		this.isSideBarVisible = !this.isSideBarVisible;
	}

	@HostListener('window:resize', ['$event'])
	public onResize(event) {
		this.frameWidth = (window.innerWidth);
		this.frameHeight = (window.innerHeight);
		this.addHeaderMenu();
	}

}
