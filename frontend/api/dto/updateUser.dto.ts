import { UserDto } from "./user.dto";

export interface UpdateUserDto extends Partial<Omit<UserDto, 'id'|'firstName'|'lastName'|'createdAt'|'updatedAt'|'deletedAt'|'roles'|'provider'|'providerId'>> {
    email?: string,
    currentPassword?: string
    password?: string
    passwordConfirmation?: string
}