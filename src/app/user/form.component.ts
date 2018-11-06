import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AlertService, AuthService, UserService, User, ProjectService, Project } from '../_service/index';

@Component({
    templateUrl: './form.component.html'
})
export class UserFormComponent implements OnInit, OnDestroy {

    loading = false;

    id: string;
    userId: string;
    create: boolean = true;
    model: User = new User();
    projectsAll: any[] = [];
    sub: Subscription;
    subProjects: Subscription;

    constructor(
        private alertService: AlertService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private service: UserService,
        private projectService: ProjectService
    ) { }

    ngOnInit() {
        this.userId = this.authService.getUserInfo().id;
        this.id = this.route.snapshot.paramMap.get('id');
        this.create = !(this.id != '' && this.id != null);
        this.subProjects = this.projectService.getAll().subscribe(
            data => {
                this.loading = false;
                this.projectsAll = data.map(x => { return {
                    name: x.name, desc: x.desc, value: x._id, checked: false }; });
                if (!this.create) this.load();
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe();
        if (this.subProjects) this.subProjects.unsubscribe();
    }

    load() {
        this.loading = true;
        this.sub = this.service.getById(this.id).subscribe(
            data => {
                this.model = data;
                this.model.projects.forEach(id => {
                    let p = this.projectsAll.find(x => x.value == id);
                    if (p) p.checked = true;
                });
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    submit() {
        this.loading = true;
        this.model.projects = <[string]>this.projectsAll.filter(x => x.checked).map(x => x.value);
        if (this.create) {
            this.service.create(this.model).subscribe(
                data => {
                    this.alertService.success(data.message, true);
                    this.router.navigate(['users']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        } else {
            this.service.update(this.id, this.model).subscribe(
                data => {
                    this.alertService.success(data.message, true);
                    this.router.navigate(['users']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        }
    }
}
