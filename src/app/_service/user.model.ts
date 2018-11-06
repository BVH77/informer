export class User {
    _id: string;
    name: string;
    email: string;
    password: string;
    authority: string = 'ROLE_USER';
    projects: [string]
}
