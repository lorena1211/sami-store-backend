import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, QueryProductsDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';

@ApiTags('prodcuts')
@Controller('products')
export class ProductsController {
    constructor(private products: ProductsService) {}

    @Get() findAll(@Query() q: QueryProductsDto) { return this.products.findAll(q); }
    @Get(':id') findOne(@Param('id', ParseUUIDPipe) id: string) { return this.products.findOne(id); }

    @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN)
    @Post() create(@Body() dto: CreateProductDto) { return this.products.create(dto); }

    @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN)
    @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
        return this.products.update(id, dto);
    }

    @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN)
    @Delete(':id') remove(@Param('id', ParseUUIDPipe) id:string) { return this.products.remove(id); }

}
