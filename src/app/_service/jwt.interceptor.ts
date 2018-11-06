import { Injectable } from '@angular/core';
import { 
    HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse 
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';

import { AuthService } from './auth.service';
import { TokenStorage } from './token.storage';

const TOKEN_HEADER_KEY = 'authorization';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private token: TokenStorage, private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // add authorization header with jwt token if available
  let authReq = req;
  if (this.token.getToken() != null) {
    authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, this.token.getToken())});
  }
  return next.handle(authReq).do((event: any) => {},
    ( error: any ) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          this.auth.deAuth();
        }
      }
    }
  );
}
}
