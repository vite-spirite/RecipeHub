import {Roles} from '../enums/roles.enum'
import {Provider} from '../enums/provider.enum'

export interface UserDto {
    id: number;
    email: string|null;
    firstName: string;
    lastName: string;
    picture: string;
    created_at: string;
    updated_at: string;
    roles: Roles;
    provider: Provider;
    providerId: string|null;
}