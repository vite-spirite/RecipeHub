export interface CategoryDto {
    id: number;
    name: string;
    slug: string;
    picture?: string|null;
    createdAt: Date;
    updatedAt: Date;
}