import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import { ReviewService } from './review.service';
import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Body,
    HttpStatus,
    HttpException,
    UsePipes,
    ValidationPipe,
    UseGuards,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';
import { REVIEW_NOT_FOUND } from './review.constans';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateReviewDto) {
        return this.reviewService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedeDoc = await this.reviewService.delete(id);
        if (!deletedeDoc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return deletedeDoc;
    }

    @Get('byProduct/:productId')
    async getByProduct(
        @Param('productId', IdValidationPipe) productId: string,
    ) {
        return this.reviewService.findByProductId(productId);
    }
}
