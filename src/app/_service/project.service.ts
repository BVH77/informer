import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { API_PATH } from '../config';

@Injectable()
export class ProjectService {

    private url = API_PATH + '/projects/';

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(this.url).pipe(catchError(this.handleError));
    }

    getById(id: string) {
        return this.http.get(this.url + id).pipe(catchError(this.handleError));
    }

    create(entry: any) {
        return this.http.post(this.url, entry).pipe(catchError(this.handleError));
    }

    update(id: string, entry: any) {
        return this.http.put(this.url + id, entry).pipe(catchError(this.handleError));
    }

    delete(id: string) {
        return this.http.delete(this.url + id).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse | any) {
        if (isDevMode()) console.error(error);
        return Observable.throw(error.error.message || error.message || error);
    }
}