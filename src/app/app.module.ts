import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SystelabComponentsModule } from 'systelab-components';
import { SystelabTranslateModule } from 'systelab-translate';
import { SystelabPreferencesModule } from 'systelab-preferences';
import { BASE_PATH } from './shared/variables';
import { environment } from '../environments/environment';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from './app.routing';
import { MessagePopupService } from 'systelab-components/widgets/modal/message-popup/message-popup.service';
import { DialogService } from 'systelab-components/widgets/modal/dialog/dialog.service';
import { SystelabLoginModule } from 'systelab-login';
import { LoginComponent } from './login/login.component';
import { EmptyBodyInterceptor } from './shared/api/empty-body.interceptor';
import { GridContextMenuComponent } from 'systelab-components/widgets/grid/contextmenu/grid-context-menu.component';
import { GridHeaderContextMenuComponent } from 'systelab-components/widgets/grid/contextmenu/grid-header-context-menu.component';
import { AgGridModule } from 'ag-grid-angular';
import { DndModule } from 'ng2-dnd';
import { SummaryComponent } from './main/summary/summary.component';
import { SkillQuestionnaireComponent } from './main/skill/skill-questionnaire.component';
import { SystelabChartsModule } from 'systelab-charts';
import { HeaderComponent } from './shared/components/header/header.component';
import { CompareComponent } from './main/compare/compare.component';
import { SideBarComponent } from './shared/components/sidebar/sidebar.component';
import { SkillsTableComponent } from './shared/components/skills-table/skills-table.component';
import { TopUsersComponent } from './main/top-users/top-users.component';
import { UsersTableComponent } from './shared/components/users-table/users-table.component';
import { SubSideBarComponent } from './shared/components/sidebar/subsidebar.component';
import { MySummaryComponent } from './main/mysummary/my-summary.component';
import { SkillsToImproveComponent } from './shared/components/skills-to-improve-table/skills-to-improve-table.component';

@NgModule({
	imports:         [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		SystelabTranslateModule.forRoot(),
		SystelabPreferencesModule.forRoot(),
		SystelabComponentsModule.forRoot(),
		SystelabChartsModule.forRoot(),
		SystelabLoginModule.forRoot(),
		DndModule.forRoot(),
		AgGridModule.withComponents([
			GridContextMenuComponent,
			GridHeaderContextMenuComponent
		]),
		AppRoutingModule
	],
	declarations:    [
		AppComponent,
    HeaderComponent,
		MainComponent,
		PageNotFoundComponent,
		LoginComponent,
    SkillQuestionnaireComponent,
    SummaryComponent,
    CompareComponent,
    SideBarComponent,
    SubSideBarComponent,
    SkillsTableComponent,
    TopUsersComponent,
    UsersTableComponent,
    MySummaryComponent,
    SkillsToImproveComponent
	],
	providers:       [
		{provide: BASE_PATH, useValue: environment.API_BASE_PATH},
		{provide: HTTP_INTERCEPTORS, useClass: EmptyBodyInterceptor, multi: true},
    MessagePopupService,
		DialogService
	],
	entryComponents: [
	],
	bootstrap:       [AppComponent]
})
export class AppModule {
}
