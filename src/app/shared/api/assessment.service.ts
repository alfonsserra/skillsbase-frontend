import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_PATH } from '../variables';
import { ApiGlobalsService } from '../../globals/globals.service';
import { BaseService } from './base.service';
import { SkillAssessment } from '../model/skill-assessment';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService extends BaseService {

  constructor(protected httpClient: HttpClient, protected apiGlobalsService: ApiGlobalsService,
              @Optional() @Inject(BASE_PATH) basePath: string) {
    super(basePath, apiGlobalsService);
  }

  /**
   * Get User Assessment
   *
   */
  public getUserAssessment(): Observable<Array<SkillAssessment>> {

    return this.httpClient.get<any>(`${this.basePath}/assessments`, {
      headers: this.getAuthorizationHeader()
    });
  }

  /**
   * Save User Assessment
   *
   * @param assessment Assessment
   */
  public saveUserAssessment(assessment: Array<SkillAssessment>): Observable<Array<SkillAssessment>> {
    if (assessment === null || assessment === undefined) {
      throw new Error('Required parameter assessment was null or undefined when calling saveUserAssessment.');
    }

    return this.httpClient.put<any>(`${this.basePath}/assessments`, assessment, {
      headers: this.getAuthorizationHeader()
    });
  }

  /**
   * Save User Assessment
   *
   * @param assessment Assessment
   */
  public saveUserSkillAssessment(skillAssessment: SkillAssessment): Observable<SkillAssessment> {
    if (skillAssessment === null || skillAssessment === undefined) {
      throw new Error('Required parameter skillAssessment was null or undefined when calling saveUserSkillAssessment.');
    }

    return this.httpClient.put<any>(`${this.basePath}/assessments/skill`, skillAssessment, {
      headers: this.getAuthorizationHeader()
    });
  }

}
