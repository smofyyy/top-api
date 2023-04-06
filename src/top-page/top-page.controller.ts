import { TopPageService } from './top-page.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
    constructor(private readonly topPageService: TopPageService) {}

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {
        return await this.topPageService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const page = await this.topPageService.findById(id);
        if (!page) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return page;
    }

    @Get('byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        const page = await this.topPageService.findByAlias(alias);
        if (!page) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return page;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedPage = await this.topPageService.deleteById(id);
        if (!deletedPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async patch(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: CreateTopPageDto,
    ) {
        const updatedPage = await this.topPageService.updateById(id, dto);
        if (!updatedPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }
        return updatedPage;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindTopPageDto) {
        return this.topPageService.findByCategory(dto.firstCategory);
    }
}
