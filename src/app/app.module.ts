import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule, NgxPermissionsGuard } from 'ngx-permissions';

import { AlertService, AuthGuard, AlertComponent, ProjectService, InfoService,
    AuthService, UserService, TokenStorage, UserStorage, JwtInterceptor
} from './_service/index';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserListComponent } from './user/list.component';
import { UserFormComponent } from './user/form.component';
import { ProjectListComponent } from './project/list.component';
import { ProjectFormComponent } from './project/form.component';
import { InfoListComponent } from './info/list.component';
import { InfoFormComponent } from './info/form.component';

const routes: Routes = [
    {
        path: '', component: InfoListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'info-form', component: InfoFormComponent,
        canActivate: [AuthGuard]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    {
        path: 'users', component: UserListComponent,
        canActivate: [AuthGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ROLE_ADMIN'], redirectTo: 'login' } }
    },
    {
        path: 'user-form', component: UserFormComponent,
        canActivate: [AuthGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ROLE_ADMIN'], redirectTo: 'login' } }
    },

    {
        path: 'projects', component: ProjectListComponent,
        canActivate: [AuthGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ROLE_ADMIN'], redirectTo: 'login' } }
    },
    {
        path: 'project-form', component: ProjectFormComponent,
        canActivate: [AuthGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ROLE_ADMIN'], redirectTo: 'login' } }
    },

    { path: '**', redirectTo: '' }
];

@NgModule({
    declarations: [
        AppComponent,
        AlertComponent,
        NavComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        UserListComponent,
        UserFormComponent,
        ProjectListComponent,
        ProjectFormComponent,
        InfoListComponent,
        InfoFormComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule.forRoot(),
        NgxPermissionsModule.forRoot(),
        FormsModule,
        RouterModule.forRoot(routes)
    ],
    providers: [
        AlertService,
        AuthGuard,
        AuthService,
        UserService,
        ProjectService,
        InfoService,
        TokenStorage,
        UserStorage,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
