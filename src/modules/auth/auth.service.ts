import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterUserDto) {
    if (!dto.email && !dto.phone) throw new BadRequestException('Either email or phone is required.');
    const user = await this.usersService.createUserWithProfile(dto);
    return {
      message: 'User registered successfully.',
      userId: user.id,
      accountType: user.accountType,
      nextStep: dto.accountType === 'OWNER' ? 'complete_owner_profile' : 'verify_account'
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailOrPhone(dto.emailOrPhone);
    if (!user) throw new UnauthorizedException('Invalid credentials.');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials.');

    return {
      accessToken: await this.jwtService.signAsync({ sub: user.id, accountType: user.accountType }),
      refreshToken: 'refresh-token-placeholder',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        status: user.status
      }
    };
  }
}
