import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
    TopPageDocument,
    TopPageModel,
    TopLevelCategory,
} from './top-page.model';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
    constructor(
        @InjectModel(TopPageModel.name)
        private readonly topPageModel: Model<TopPageDocument>,
    ) {}

    async create(dto: CreateTopPageDto) {
        return this.topPageModel.create(dto);
    }

    async findById(id: string) {
        return this.topPageModel.findById(id).exec();
    }

    async findByCategory(firstCategory: TopLevelCategory) {
        return this.topPageModel
            .find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 })
            .exec();
    }

    async findByAlias(alias: string) {
        return this.topPageModel.findOne({ alias }).exec();
    }

    async deleteById(id: string) {
        return this.topPageModel.findByIdAndDelete(id).exec();
    }

    async updateById(id: string, dto: CreateTopPageDto) {
        return this.topPageModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
    }
}
