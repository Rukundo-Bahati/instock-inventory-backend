export class CreateMovementDto {
    itemId: string;
    type: string;
    quantity: number;
    reason?: string;
    locationId?: string;
}
