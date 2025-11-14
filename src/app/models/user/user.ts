import Role from '../enums/Role';

export interface User {
    id: number;
    username: string;
    role: Role;
    password: string;
}
