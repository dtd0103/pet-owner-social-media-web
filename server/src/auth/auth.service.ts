import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpUserDto: SignUpUserDto) {
    if (!signUpUserDto.email || !signUpUserDto.tel) {
      throw new HttpException(
        'Email and phone must not be empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existUser = await this.userRepository.findOne({
      where: [{ email: signUpUserDto.email }, { tel: signUpUserDto.tel }],
    });

    if (existUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const userName = `${signUpUserDto.firstName} ${signUpUserDto.lastName}`;
    const hashedPassword = await this.hashPassword(signUpUserDto.password);
    const newUser = this.userRepository.create({
      ...signUpUserDto,
      name: userName,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return this.generateJwtToken({
      id: newUser.id,
      email: newUser.email,
      tel: newUser.tel,
      userRole: newUser.role,
    });
  }

  async login(loginUserDto: LoginUserDto) {
    if (!loginUserDto.email && !loginUserDto.tel) {
      throw new HttpException(
        'Email or phone number must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOne({
      where: [{ email: loginUserDto.email }, { tel: loginUserDto.email }],
    });

    if (!user) {
      throw new HttpException(
        'User email or phone not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordMatching = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    return this.generateJwtToken({
      id: user.id,
      email: user.email,
      tel: user.tel,
      userRole: user.role,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async generateJwtToken(payload: {
    id: string;
    email: string;
    tel: string;
    userRole: 'Pet Owner' | 'Admin';
  }): Promise<{ access_token: string }> {
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
