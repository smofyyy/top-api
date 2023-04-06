import { ConfigService } from '@nestjs/config/dist';
import { JwtModuleOptions } from '@nestjs/jwt';
export const getJwtConfig = async (
    configService: ConfigService,
): Promise<JwtModuleOptions> => {
    return {
        secret: configService.get('JWT_SECRET'),
    };
};
