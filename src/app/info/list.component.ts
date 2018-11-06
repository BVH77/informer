import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AlertService, AuthService, InfoService, Info, Project } from '../_service/index';

@Component({
    templateUrl: './list.component.html'
})
export class InfoListComponent implements OnInit, OnDestroy {

    sub: Subscription;
    subDelete: Subscription;
    subAccept: Subscription;
    userId: string;
    isAdmin: boolean;
    items: Info[] = [];
    projects: Project[];
    loading = false;
    filters: any = {
        accepted: false,
        projectName: 'ALL PROJECTS',
        project: ''
    };

    constructor(
        private alertService: AlertService,
        private authService: AuthService,
        private service: InfoService
    ) { }

    ngOnInit() {
        this.userId = this.authService.getUserInfo().id;
        this.projects = this.authService.getUserInfo().projects;
        this.isAdmin = this.authService.isAdmin();
        this.load();
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe();
        if (this.subDelete) this.subDelete.unsubscribe();
        if (this.subAccept) this.subAccept.unsubscribe();
    }

    delete(id: string) {
        if (confirm('Delete info id: ' + id + ' ?')) {
            this.subDelete = this.service.delete(id).subscribe(
                data => {
                    this.alertService.success(data.message);
                    this.load();
                },
                error => {
                    this.alertService.error(error);
                });
        }
    }
    
    formatInfo(item) {
        let cd = new Date(item.createdAt), md = new Date(item.updatedAt);
        return  'Author: ' + item.user.name + '\n' +
                'Created: ' + cd.toLocaleDateString() + ' ' + cd.toLocaleTimeString() +
                (item.createdAt != item.updatedAt ? 
                    '\nUpdated: ' + md.toLocaleDateString() + ' ' + md.toLocaleTimeString() : '');
    }

    isAccepted(list: any[]) {
        var isAccepted = false;
        list.forEach( (x) => {
            if (x.who._id == this.userId) { isAccepted = true;}
        });
        return isAccepted;
    }
    
    formatAccepted(list: any) {
        let i = 0;
        return 'Users who have accepted:\n' + 
               list.map(x => ++i + '. ' + x.who.name + ', ' +
                       new Date(x.when).toLocaleDateString() + ' ' +
                       new Date(x.when).toLocaleTimeString()).join('\n');
    }

    accept(id: string) {
        if (confirm('Do you accept readed info?')) {
            this.subAccept = this.service.accept(id).subscribe(
                data => {
                    this.alertService.success(data.message);
                    this.load();
                },
                error => {
                    this.alertService.error(error);
                });
        }
    }

    load() {
        this.loading = true;
        this.sub = this.service.getAll(this.filters.accepted, this.filters.project).subscribe(
            data => {
                this.items = data;
                this.loading = false;
            },
            error => {
                this.loading = false;
                this.alertService.error(error);
            });
    }

}
