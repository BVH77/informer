import { Component, OnInit } from '@angular/core';
import { AuthService } from './_service/index';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
    selector: 'app-root',
    template: `<app-nav *ngIf="authService.isAuth()"></app-nav><div class="container mt-3">
               <app-alert></app-alert><router-outlet></router-outlet></div>`
})
export class AppComponent implements OnInit {

    constructor(private permissionsService: NgxPermissionsService, public authService: AuthService) { }

    ngOnInit(): void {
        const user: any = this.authService.getUserInfo();
        if (user && user.authorities) {
            this.permissionsService.loadPermissions(user.authorities);
        }
    }
}
