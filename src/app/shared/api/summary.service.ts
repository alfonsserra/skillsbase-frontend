import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_PATH } from '../variables';
import { ApiGlobalsService } from '../../globals/globals.service';
import { BaseService } from './base.service';
import { OrganizationSummary } from '../model/organization-summary';

@Injectable({
  providedIn: 'root'
})
export class SummaryService extends BaseService {

  constructor(protected httpClient: HttpClient, protected apiGlobalsService: ApiGlobalsService,
              @Optional() @Inject(BASE_PATH) basePath: string) {
    super(basePath, apiGlobalsService);
  }

  /**
   * Get Organization Summary
   *
   */
  public getOrganizationSummary(): Observable<OrganizationSummary> {

    return this.httpClient.get<any>(`${this.basePath}/summary/organization`, {
      headers: this.getAuthorizationHeader()
    });
  }

}
