import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, AuthService } from '../_service/index';

@Component({
    templateUrl: 'register.component.html'
})
export class RegisterComponent {

    loading = false;
    model: any = {};

    constructor(private router: Router, private authService: AuthService, private alertService: AlertService) { }

    register() {
        this.loading = true;
        this.authService.register(this.model.name, this.model.email, this.model.password).subscribe(
            data => {
                this.alertService.success(data.message, true);
                this.router.navigate(['login']);
            },
            error => {
                this.loading = false;
                this.alertService.error(error);
            }
        );
    }
}