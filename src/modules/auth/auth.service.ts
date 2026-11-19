import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private users: UsersService, private jwt: JwtService) {}

    async register(dto: RegisterDto) {
        if (await this.users.findByEmail(dto.email)) {
            throw new ConflictException('The email is already registered');
        }
        const password = await bcrypt.hash(dto.password, 10);
        const user = await this.users.create({ ...dto, password });
        return this.sign(user.id, user.email, user.Role);
    }

    async login(dto: LoginDto) {
        const user = await this.users.findByEmail(dto.email);
        if(!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid Credentials');
        }
        return this.sign(user.id, user.email, user.Role);
    }

    private sign(id: string, email: string, role: string) {
        return { accessToken: this.jwt.sign({ sub: id, email, role }) };
    }
}
