import { Component, ViewEncapsulation } from '@angular/core';
import { I18nService } from 'systelab-translate/lib/i18n.service';
import { MigrationService } from './shared/migrate/migration.service';

@Component({
  selector: 'app-root',
  template: `
                <router-outlet></router-outlet>`,
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(protected i18nService: I18nService,protected migrationService:MigrationService) {

    i18nService.use('en')
      .subscribe(() => console.log('Language set to en'),
        (error) => console.log('Error setting the language.'));
  }
}
