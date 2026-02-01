import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey =
      request.headers['x-api-key'] ??
      this.extractBearerToken(request.headers['authorization']);

    const expectedKey = process.env.X_API_KEY;
    if (!expectedKey) {
      throw new UnauthorizedException('API key is not configured');
    }
    if (!apiKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }

  private extractBearerToken(authHeader: string | undefined): string | undefined {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.slice(7);
  }
}
