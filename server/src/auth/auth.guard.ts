import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      request['user'] = payload;
      console.log('Request:', request['user']);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: error.message || 'Invalid or expired token',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }

  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
