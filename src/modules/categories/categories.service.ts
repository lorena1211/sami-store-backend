import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}
    findAll() { return this.prisma.category.findMany({ orderBy: { name: 'asc' } }); }

    async create(dto: CreateCategoryDto) {
        try {
            return await this.prisma.category.create({ data: dto });
        }catch (error: any) {
            // P2002 -> Single field violation (repeated slug)
            if (error?.code === 'P2002') {
                throw new ConflictException('There is already a category with that slug');
            }
            throw error;
        }
    }
}
