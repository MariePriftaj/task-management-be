import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // merr token nga header "Authorization: Bearer ..."
      ignoreExpiration: false, // refuzon token-e te skaduara
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
    });
  }

  async validate(payload: any) {
    // Kthen informacionin që do të vendoset te req.user
    return { userId: payload.sub, email: payload.email };
  }
}
