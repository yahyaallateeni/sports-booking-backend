import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('يجب إدخال البريد الإلكتروني أو رقم الجوال.');
    }

    try {
      const user = await this.usersService.createUserWithProfile(dto);

      return {
        message: 'تم إنشاء الحساب بنجاح.',
        userId: user.id,
        accountType: user.accountType,
        nextStep:
          dto.accountType === 'OWNER'
            ? 'complete_owner_profile'
            : 'verify_account',
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target.join(', ')
          : String(error.meta?.target || '');

        if (target.includes('email')) {
          throw new ConflictException('البريد الإلكتروني مستخدم مسبقًا.');
        }

        if (target.includes('phone')) {
          throw new ConflictException('رقم الجوال مستخدم مسبقًا.');
        }

        throw new ConflictException('هذه البيانات مستخدمة مسبقًا.');
      }

      throw error;
    }
  }

  async login(dto: LoginDto) {
    if (!dto.emailOrPhone) {
      throw new BadRequestException('البريد الإلكتروني أو رقم الجوال مطلوب.');
    }

    const user = await this.usersService.findByEmailOrPhone(dto.emailOrPhone);
    if (!user) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة.');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة.');
    }

    const accessSecret =
      process.env.JWT_ACCESS_SECRET || 'fallback-access-secret-2026';
    const accessExpiresIn =
      process.env.JWT_ACCESS_EXPIRES_IN || '15m';

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        accountType: user.accountType,
      },
      {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      },
    );

    const refreshSecret =
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-2026';
    const refreshExpiresIn =
      process.env.JWT_REFRESH_EXPIRES_IN || '30d';

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        accountType: user.accountType,
        type: 'refresh',
      },
      {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.profile?.fullName || '',
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        accountType: user.accountType,
        status: user.status,
      },
    };
  }
}
