import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AlertService, AuthService, UserService, User } from '../_service/index';

@Component({
    templateUrl: './list.component.html'
})
export class UserListComponent implements OnInit, OnDestroy {

    sub: Subscription;
    subDelete: Subscription;
    items: User[] = [];
    userId: string;
    loading = false;

    constructor(
        private alertService: AlertService,
        private authService: AuthService,
        private service: UserService
    ) { }

    ngOnInit() {
        this.userId = this.authService.getUserInfo().id;
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
