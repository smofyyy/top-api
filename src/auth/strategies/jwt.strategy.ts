import { ConfigService } from '@nestjs/config/dist';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from '../user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExporation: true,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate({ email }: Pick<UserModel, 'email'>) {
        return email;
    }
}
