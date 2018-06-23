import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_PATH } from '../variables';
import { ApiGlobalsService } from '../../globals/globals.service';
import { BaseService } from './base.service';
import { Skill } from '../model/skill';

@Injectable({
	providedIn: 'root'
})
export class SkillService extends BaseService {

	constructor(protected httpClient: HttpClient, protected apiGlobalsService: ApiGlobalsService,
	            @Optional() @Inject(BASE_PATH) basePath: string) {
		super(basePath, apiGlobalsService);
	}

	/**
	 * Create a Skill
	 *
	 * @param s Skill
	 */
	public createCategory(s: Skill): Observable<Skill> {
		if (s === null || s === undefined) {
			throw new Error('Required parameter s was null or undefined when calling createCategoryUsingPOST.');
		}

		return this.httpClient.post<any>(`${this.basePath}/skills/category`, s, {
			headers: this.getAuthorizationHeader()
		});
	}

	/**
	 * Get all Skills
	 *
	 */
	public getAllCategories(): Observable<Array<Skill>> {

		return this.httpClient.get<any>(`${this.basePath}/skills`, {
			headers: this.getAuthorizationHeader()
		});
	}

	/**
	 * Get Skill
	 *
	 * @param uid uid
	 */
	public getCategory(uid: number): Observable<Skill> {
		if (uid === null || uid === undefined) {
			throw new Error('Required parameter uid was null or undefined when calling getCategoryUsingGET.');
		}

		return this.httpClient.get<any>(`${this.basePath}/skills/${encodeURIComponent(String(uid))}`, {
			headers: this.getAuthorizationHeader()
		});
	}

	/**
	 * Delete a Skill
	 *
	 * @param uid uid
	 */
	public removeCategory(uid: number): Observable<any> {
		if (uid === null || uid === undefined) {
			throw new Error('Required parameter uid was null or undefined when calling removeCategoryUsingDELETE.');
		}

		return this.httpClient.delete<any>(`${this.basePath}/skills/${encodeURIComponent(String(uid))}`, {
			headers: this.getAuthorizationHeader()
		});
	}

	/**
	 * Create or Update (idempotent) an existing Skill
	 *
	 * @param uid uid
	 * @param s Skill
	 */
	public updateCategory(uid: number, s: Skill): Observable<Skill> {
		if (uid === null || uid === undefined) {
			throw new Error('Required parameter uid was null or undefined when calling updateCategoryUsingPUT.');
		}
		if (s === null || s === undefined) {
			throw new Error('Required parameter s was null or undefined when calling updateCategoryUsingPUT.');
		}

		return this.httpClient.put<any>(`${this.basePath}/skills/${encodeURIComponent(String(uid))}`, s, {
			headers: this.getAuthorizationHeader()
		});
	}

}
