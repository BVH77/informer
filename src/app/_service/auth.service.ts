import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgxPermissionsService } from 'ngx-permissions';

import { TokenStorage } from './token.storage';
import { UserStorage } from './user.storage';
import { API_PATH } from '../config';

@Injectable()
export class AuthService {

    private authUrl = API_PATH + '/auth/login';
    private registerUrl = API_PATH + '/auth/register';

    constructor(
        private http: HttpClient,
        private token: TokenStorage,
        private user: UserStorage,
        public permissionsService: NgxPermissionsService
    ) { }

    attemptAuth(email: string, password: string): Observable<any> {
        return this.http.post(this.authUrl, 
            { email: email, password: password }).pipe(catchError(this.handleError));
    }

    setAuth(data): void {
        this.token.saveToken(data.token);
        this.user.saveUser(data);
        this.permissionsService.flushPermissions();
        this.permissionsService.addPermission(data.authority);
    }

    deAuth(): void {
        this.token.signOut();
        this.user.signOut();
        this.permissionsService.flushPermissions();
    }

    getUserInfo() {
        return this.user.getUser();
    }
    
    isAdmin() {
        return "ROLE_ADMIN" == this.getUserInfo().authority;
    }

    isAuth() {
        return (this.token.getToken()) ? true : false;
    }

    register(name: string, email: string, password: string) {
        return this.http.post(this.registerUrl,
            { name: name, email: email, password: password }).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse | any) {
        if (isDevMode()) console.error(error);
        return Observable.throw(error.error.message || error.message || error);
    }

}
