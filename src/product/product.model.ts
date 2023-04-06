import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = ProductModel & Document;

class ProductCharacteristics {
    @Prop()
    name: string;

    @Prop()
    value: string;
}

@Schema({
    timestamps: true,
    collection: 'products',
})
export class ProductModel {
    @Prop()
    image: string;

    @Prop()
    title: string;

    @Prop()
    price: number;

    @Prop()
    oldPrice?: number;

    @Prop()
    credit: number;

    @Prop()
    calculatedRating: number;

    @Prop()
    description: string;

    @Prop()
    advantages: string;

    @Prop()
    disAdvantages: string;

    @Prop([String])
    categories: string[];

    @Prop()
    tags: string[];

    @Prop([ProductCharacteristics])
    characteristics: ProductCharacteristics[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
