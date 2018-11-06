import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { NgxPermissionsService } from 'ngx-permissions';

import { AuthService, AlertService } from '../_service/index';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit, OnDestroy {

    user: any;

    constructor(
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router,
        private permissionsService: NgxPermissionsService
    ) {
    }

    ngOnInit() {
        if (this.authService.isAuth()) {
            this.user = this.authService.getUserInfo();
            this.permissionsService.addPermission(this.user.authority);
        }
    }

    ngOnDestroy() {
    }
}
