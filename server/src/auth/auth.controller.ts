import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signUpUserDto: SignUpUserDto): Promise<any> {
    return this.authService.signUp(signUpUserDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.authService.login(loginUserDto);
  }
}
