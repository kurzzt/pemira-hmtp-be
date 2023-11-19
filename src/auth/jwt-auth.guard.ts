import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private config: ConfigService,
        private userService: UserService,
        private reflector: Reflector,
        private jwtService: JwtService,
    ) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true

        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if (!token) throw new UnauthorizedException('Login first')

        try {
            const payload = this.jwtService.verify( token, { secret: this.config.get<string>('JWT_SECRET') })
            const { isAdmin } = await this.userService.isExist(payload.sub)
            request['user'] = { ...payload, isAdmin }
        } catch (err) {
            throw new UnauthorizedException(`${err}`)
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}