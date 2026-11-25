import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, QueryProductsDto, UpdateProductDto } from './dto/product.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async findAll(q: QueryProductsDto) {
        const where: Prisma.ProductScalarWhereInput = {
            active: true,
            ...(q.category && { category: { slug: q.category } }),
            ...(q.search && { name: { contains: q.search, mode: 'insensitive' } }),
            ...((q.size || q.color) && {
                variants: {
                    some: {
                        ...(q.size && { size: q.size }),
                        ...(q.color && { color: q.color }),
                    },
                },
            }),
            ...((q.minPrice != null || q.maxPrice != null) && {
                price: { gte: q.minPrice, lte: q.maxPrice },
            }),
        };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                include: { category: true, variants: true },
                orderBy: { createdAt: 'desc' },
                skip: (q.page -1) * q.limit,
                take: q.limit,
            }),
            this.prisma.product.count({ where }),
        ]);

        return { items, total, page: q.page, pages: Math.ceil(total / q.limit) };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true, variants: true },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    create(dto: CreateProductDto) {
        const { variants, ...data } = dto;
        return this.prisma.product.create({
            data: { ...data, variants: { create: variants } },
            include: { variants: true },
        });
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findOne(id);
        const { variants, ...data } = dto;
        return this.prisma.product.update({
            where: { id },
            data: {
                ...data,
                ...(variants && { variants: { deleteMany: {}, create: variants } }),
            },
            include: { variants: true },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        // Logic erase
        return this.prisma.product.update({ where: { id }, data: { active: false } });
    }
}
