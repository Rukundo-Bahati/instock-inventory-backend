export class UpdateItemDto {
    name?: string;
    sku?: string;
    description?: string;
    price?: number;
    quantity?: number;
    minStock?: number;
    categoryId?: string;
    locationId?: string;
    image?: string;
    tags?: string[];
    status?: string;
}
