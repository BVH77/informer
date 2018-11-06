import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, AuthService } from '../_service/index';

@Component({
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    
    model: any = {};
    loading = false;

    constructor(private authService: AuthService, private alertService: AlertService, 
                private router: Router) { }

    ngOnInit() {
        this.authService.deAuth();
    }

    login() {
        this.loading = true;
        this.authService.attemptAuth(this.model.email, this.model.password).subscribe(
            data => {
                this.authService.setAuth(data);
                this.router.navigate(['']);
            },
            error => {
                this.loading = false;
                this.alertService.error(error);
            }
        );
    }
}
