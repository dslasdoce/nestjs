import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

interface RequestWithUser {
  user: {
    userId: number;
    username: string;
    isAdmin: boolean;
  };
}

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;
    context.switchToHttp().getRequest<RequestWithUser>();
    return super.canActivate(context);
  }
}

export const Public = () => SetMetadata('isPublic', true);
