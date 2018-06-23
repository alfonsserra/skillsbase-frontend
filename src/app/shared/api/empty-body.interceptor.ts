import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError as _throw } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiGlobalsService } from '../../globals/globals.service';
import { Router } from '@angular/router';

// Trick to solve error corrected in version 5.2 by Alex and Misko in https://github.com/angular/angular/commit/503be69af65e85def00da1d2a049e8ebb8059e47
@Injectable({
	providedIn: 'root'
})
export class EmptyBodyInterceptor implements HttpInterceptor {

	constructor(protected globalService: ApiGlobalsService, private router: Router) {

	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request)
			.pipe(catchError(response => {
				if (response instanceof HttpErrorResponse) {

					// Check if this error has a 2xx status
					if (this.is2xxStatus(response)) {

						// Convert the error to a standard response with a null body and then return
						return of(new HttpResponse({
							headers:    response.headers,
							status:     response.status,
							statusText: response.statusText,
							url:        response.url
						}));
					} else {
						if (this.is401Or0Status(response)) {
							this.globalService.bearer = undefined;
							this.router.navigate(['/login']);
						}
					}
				}
				// This is a real error, rethrow
				return _throw(response);
			}));
	}

	private is2xxStatus(response: HttpResponseBase) {
		return response.status >= 200 && response.status < 300 && response.statusText === 'OK';
	}

	private is401Or0Status(response: HttpResponseBase) {
		return response.status === 401 || response.status === 0;
	}

}
