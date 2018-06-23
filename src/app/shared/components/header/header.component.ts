import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChangePasswordDialog, ChangePasswordDialogParameters } from 'systelab-login/widgets/change-password-dialog.component';
import { Observable, of as observableOf } from 'rxjs';
import { MessagePopupService } from 'systelab-components/widgets/modal/message-popup/message-popup.service';
import { DialogService } from 'systelab-components/widgets/modal/dialog/dialog.service';

import { I18nService } from 'systelab-translate/lib/i18n.service';
import { UserService } from '../../api/user.service';
import { ApiGlobalsService } from '../../../globals/globals.service';

@Component({
  selector:    'header',
  templateUrl: 'header.component.html',
  styleUrls:   ['header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() public clickMenu = new EventEmitter();
  public userFullName;

  constructor(protected messagePopupService: MessagePopupService,
              protected dialogService: DialogService, protected i18nService: I18nService,
              protected userService: UserService, protected apiGlobalsService: ApiGlobalsService) {
  }

  public ngOnInit() {
    this.userFullName = this.apiGlobalsService.userFullName;
  }

  public doChangePassword() {
    const parameters: ChangePasswordDialogParameters = ChangePasswordDialog.getParameters();
    parameters.minPasswordStrengthValue = 1;
    parameters.action = (a, b) => this.changePassword(a, b);
    this.dialogService.showDialog(ChangePasswordDialog, parameters)
      .subscribe();
  }

  public changePassword(oldPassword: string, newPassword: string): Observable<boolean> {

    this.userService.changePassword(oldPassword, newPassword)
      .subscribe(
        (user) => {
          return observableOf(true);
        },
        (error) => {
          this.i18nService.get(['ERR_ERROR', 'ERR_IMPOSSIBLE_CHANGE_PASSWORD'])
            .subscribe((res) => {
              this.messagePopupService.showErrorPopup(res.COMMON_ERROR, res.COMMON_IMPOSSIBLE_CHANGE_PASSWORD);
              return observableOf(false);
            });

        }
      );
    return observableOf(true);
  }

  public doLogout() {
    this.apiGlobalsService.userFullName = '';
    window.location.reload();
  }

  public doClickSideBar() {
    this.clickMenu.emit();
  }

}