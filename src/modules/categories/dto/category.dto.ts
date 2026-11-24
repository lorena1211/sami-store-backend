import { IsString, Matches, MinLength } from "class-validator";


export class CreateCategoryDto {
    @IsString() @MinLength(2)
    name: string;

    @IsString() @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'The slug only accepts lowercase letters, numbers and hyphens',
    })
    slug: string;
}