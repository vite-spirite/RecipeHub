export interface IngredientDto {
    id: number;
    name: string;
    unit: string;
    slug: string;
    picture?: string;
    createdAt: Date;
    updatedAt: Date;
}