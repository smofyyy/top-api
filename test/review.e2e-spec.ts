import { REVIEW_NOT_FOUND } from './../src/review/review.constans';
import { CreateReviewDto } from './../src/review/dto/create-review.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
    login: 'a1@a.ru',
    password: '1',
};

const testDto: CreateReviewDto = {
    name: 'Test',
    title: 'Title',
    description: 'Description',
    rating: 5,
    productId: productId,
};

describe('ReviewController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;
    let token: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto);

        token = res.body.access_token;
    });

    it('/review/create (POST) - success', async () => {
        await request(app.getHttpServer())
            .post('/review/create')
            .send(testDto)
            .expect(201)
            .then(({ body }: request.Response) => {
                createdId = body._id;
                expect(createdId).toBeDefined();
            });
        return Promise.resolve();
    });

    it('/review/create (POST) - fail', async () => {
        await request(app.getHttpServer())
            .post('/review/create')
            .send({ ...testDto, rating: 0 })
            .expect(400)
            .then(({ body }: request.Response) => {
                console.log(body);
            });
        return Promise.resolve();
    });

    it('/review/byProduct/:productId (GET) - success', async () => {
        await request(app.getHttpServer())
            .get('/review/byProduct/' + productId)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBe(1);
            });
        return Promise.resolve();
    });

    it('/review/byProduct/:productId (GET) - fail', async () => {
        await request(app.getHttpServer())
            .get('/review/byProduct/' + new Types.ObjectId().toHexString())
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBe(0);
            });
        return Promise.resolve();
    });

    it('/review/delete (DELETE) - success', () => {
        return request(app.getHttpServer())
            .delete('/review/' + createdId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    });

    it('/review/delete (DELETE) - fail', () => {
        return request(app.getHttpServer())
            .delete('/review/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(404, {
                statusCode: 404,
                message: REVIEW_NOT_FOUND,
            });
    });

    afterAll(() => {
        disconnect();
    });
});
