import { Component, Input } from '@angular/core';
import { UserRate } from '../../model/user-rate';

@Component({
	selector:    'users-table',
	templateUrl: 'users-table.component.html',
	styleUrls:   ['users-table.component.scss']
})
export class UsersTableComponent {

	@Input() public data: Array<UserRate>;
	@Input() public isProficiency;

	constructor() {
	}

}
