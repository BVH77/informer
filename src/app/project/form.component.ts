import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AlertService, ProjectService, Project } from '../_service/index';

@Component({
    templateUrl: './form.component.html'
})
export class ProjectFormComponent implements OnInit, OnDestroy {

    loading = false;

    id: string;
    create: boolean = true;
    model: Project = new Project();
    sub: Subscription;

    constructor(
        private alertService: AlertService,
        private route: ActivatedRoute,
        private router: Router,
        private service: ProjectService
    ) { }

    ngOnInit() {
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
                    this.router.navigate(['projects']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        } else {
            this.service.update(this.id, this.model).subscribe(
                data => {
                    this.alertService.success(data.message, true);
                    this.router.navigate(['projects']);
                },
                error => {
                    this.loading = false;
                    this.alertService.error(error);
                });
        }
    }
}
