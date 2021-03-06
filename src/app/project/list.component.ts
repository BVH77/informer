﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AlertService, ProjectService, Project } from '../_service/index';

@Component({
    templateUrl: './list.component.html'
})
export class ProjectListComponent implements OnInit, OnDestroy {

    sub: Subscription;
    subDelete: Subscription;
    items: Project[] = [];
    loading = false;

    constructor(private alertService: AlertService, private service: ProjectService) { }

    ngOnInit() {
        this.load();
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe();
        if (this.subDelete) this.subDelete.unsubscribe();
    }

    delete(id: string, name: string) {
        if (confirm('Delete "' + name + '" ?')) {
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
    
    load() {
        this.loading = true;
        this.sub = this.service.getAll().subscribe(
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
