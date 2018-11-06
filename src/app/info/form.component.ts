import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AlertService, AuthService, InfoService, Info, Project } from '../_service/index';

@Component({
    templateUrl: './form.component.html'
})
export class InfoFormComponent implements OnInit, OnDestroy {

    loading = false;

    id: string;
    userId: string;
    isAdmin: boolean;
    create: boolean = true;
    model: Info = new Info();
    projects: Project[];
    sub: Subscription;

    constructor(
        private alertService: AlertService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private service: InfoService
    ) { }

    ngOnInit() {
        this.userId = this.authService.getUserInfo().id;
        this.projects = this.authService.getUserInfo().projects;
        this.isAdmin = this.authService.isAdmin();
        this.id = this.route.snapshot.paramMap.get('id');
        this.create = !(this.id != '' && this.id != null);
        if (!this.create) this.load();
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe();
    }

    load() {
        this.loading = true;
        this.sub = this.service.getById(this.id).subscribe(
            data => {
                this.model = data;
                this.loading = false;
            },
            error => {
                this.loading = false;
                this.alertService.error(error);
            });
    }

    submit() {
        this.loading = true;
        if (this.create) {
            this.service.create(this.model).subscribe(
                data => {
                    this.alertService.success(data.message, true);
                    this.router.navigate(['']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        } else {
            this.service.update(this.id, this.model).subscribe(
                data => {
                    this.alertService.success(data.message, true);
                    this.router.navigate(['']);
                },
                error => {
                    this.loading = false;
                    this.alertService.error(error);
                });
        }
    }
}
