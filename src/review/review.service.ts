import { CreateReviewDto } from './dto/create-review.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewDocument, ReviewModel } from './review.model';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(ReviewModel.name)
        private readonly reviewModel: Model<ReviewDocument>,
    ) {}

    async create(dto: CreateReviewDto): Promise<ReviewModel> {
        return this.reviewModel.create(dto);
    }

    async delete(id: string): Promise<ReviewModel> | null {
        return this.reviewModel.findByIdAndDelete(id).exec();
    }

    async findByProductId(productId: string): Promise<any> {
        return this.reviewModel.find({ productId: productId }).exec();
    }

    async deleteByProductId(productId: string) {
        return this.reviewModel.deleteMany({ productId: productId }).exec();
    }
}
