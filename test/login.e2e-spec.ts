import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { AuthDto } from 'src/auth/dto/auth.dto';
import {
    USER_NOT_FOUND_ERROR,
    WRONG_PASSWORD_ERROR,
} from '../src/auth/auth.constants';
import { disconnect } from 'mongoose';

const loginDto: AuthDto = {
    login: 'a1@a.ru',
    password: '1',
};

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;
    let token: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/login (post) - success', async () => {
        await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.access_token).toBeDefined();
            });
        return Promise.resolve();
    });

    it('/auth/login (post) - fail password', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, password: '2' })
            .expect(401, {
                statusCode: 401,
                message: WRONG_PASSWORD_ERROR,
                error: 'Unauthorized',
            });
    });

    it('/auth/login (post) - fail login', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, login: 'a2@a.ru' })
            .expect(401, {
                statusCode: 401,
                message: USER_NOT_FOUND_ERROR,
                error: 'Unauthorized',
            });
    });

    afterAll(() => {
        disconnect();
    });
});
