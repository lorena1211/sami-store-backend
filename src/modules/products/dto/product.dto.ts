import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { PartialType } from "@nestjs/swagger";

class VariantDto {
    @IsString() size: string;
    @IsString() color: string;
    @IsInt() @Min(0) stock: number;
}

export class CreateProductDto {
    @IsString() name: string;
    @IsString() description: string;
    @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price: number;
    @IsOptional() @IsString() imageUrl?: string;
    @IsUUID() categoryId: string;
    @IsArray() @ValidateNested({ each: true }) @Type(() => VariantDto)
    variants: VariantDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class QueryProductsDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
    @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit = 12;
    @IsOptional() @IsString() category?: string; // slug
    @IsOptional() @IsString() size?: string;
    @IsOptional() @IsString() color?: string;
    @IsOptional() @IsString() search?: string;
    @IsOptional() @Type(() => Number) @IsNumber() minPrice?: number;
    @IsOptional() @Type(() => Number) @IsNumber() maxPrice?: number;
}

