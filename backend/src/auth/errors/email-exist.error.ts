import { BadRequestException } from "@nestjs/common";

export class EmailExistError extends BadRequestException {
    constructor() {
        super('Email already exists');
    }
}