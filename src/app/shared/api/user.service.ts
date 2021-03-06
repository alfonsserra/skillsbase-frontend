import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { BASE_PATH } from '../variables';
import { ApiGlobalsService } from '../../globals/globals.service';
import { BaseService } from './base.service';

@Injectable({
	providedIn: 'root'
})
export class UserService extends BaseService {

	constructor(protected httpClient: HttpClient, protected apiGlobalsService: ApiGlobalsService,
	            @Optional() @Inject(BASE_PATH) basePath: string) {
		super(basePath, apiGlobalsService);
	}

	/**
	 * User Login
	 *
	 * @param login
	 * @param password
	 */
	public authenticateUser(login?: string, password?: string): Observable<HttpResponse<any>> {

		const headers = this.defaultHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
		const body = new HttpParams().set('login', login)
			.set('password', password);

		return this.httpClient.post<HttpResponseBase>(`${this.basePath}/users/login`, body, {
			headers: headers,
			observe: 'response',

		});
	}

	/**
	 * User Login
	 *
	 * @param login
	 * @param password
	 */
	public changePassword(oldpassword: string, newpassword: string): Observable<User> {

		const body = new HttpParams().set('oldpassword', oldpassword)
			.set('newpassword', newpassword);

		return this.httpClient.post<any>(`${this.basePath}/users/password`, body, {
			headers: this.getAuthorizationHeader()
		});
	}

	/**
	 * Create a User
	 *
	 * @param body User
	 */
	public create(body: User): Observable<User> {
		if (body === null || body === undefined) {
			throw new Error('Required parameter body was null or undefined when calling create.');
		}

		return this.httpClient.post<any>(`${this.basePath}/users/user`, body, {
			headers: this.getAuthorizationHeader(),
		});
	}

	/**
	 * Get User
	 *
	 * @param uid
	 */
	public findById(uid: number): Observable<User> {
		if (uid === null || uid === undefined) {
			throw new Error('Required parameter uid was null or undefined when calling findById.');
		}

		return this.httpClient.get<any>(`${this.basePath}/users/${encodeURIComponent(String(uid))}`, {
			headers: this.getAuthorizationHeader(),
		});
	}

	/**
	 * Get all Users
	 *
	 */
	public getAllUsers(): Observable<Array<User>> {

		return this.httpClient.get<any>(`${this.basePath}/users`, {
			headers: this.getAuthorizationHeader()
		});
	}

	/**
	 * Delete a User
	 *
	 * @param uid
	 */
	public remove(uid: number): Observable<{}> {
		if (uid === null || uid === undefined) {
			throw new Error('Required parameter uid was null or undefined when calling remove.');
		}

		return this.httpClient.delete<any>(`${this.basePath}/users/${encodeURIComponent(String(uid))}`, {
			headers: this.getAuthorizationHeader(),
		});
	}

}
