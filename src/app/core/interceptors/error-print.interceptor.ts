import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (err: unknown) => {
          const typedError = err as HttpErrorResponse;
          const url = new URL(request.url);
          let errorMessage = 'Check the console for the details';

          if (typedError.status === 401) {
            errorMessage = `Status: ${typedError.status}. User is unauthorized`;
          }
          if (typedError.status === 403) {
            errorMessage = `Status: ${typedError.status}. Token is invalid`;
          }
          this.notificationService.showError(
            `Request to "${url.pathname}" failed. \n ${errorMessage}`,
            0
          );
        },
      })
    );
  }
}
