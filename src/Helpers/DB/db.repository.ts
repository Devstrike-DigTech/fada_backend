import { InternalServerErrorException } from '@nestjs/common';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export class DbRepository<T extends Document> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  public async create(
    projection: string | Record<string, unknown> = {},
    data: Partial<Record<keyof T, unknown>>,
  ): Promise<T> {
    try {
      const newData = new this.model(data, projection);

      await newData.save();

      return newData;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Server Error');
    }
  }

  public async findMany(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, unknown> = {},
    options: Record<string, unknown> = {},
  ) {
    try {
      const result = await this.model.find(conditions as FilterQuery<T>, projection, options);

      return result;
    } catch (e) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  public async findOne(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, number> = {},
    options: Record<string, unknown> = {},
  ) {
    try {
      const result = await this.model.findOne(conditions as FilterQuery<T>, projection, options);

      return result;
    } catch (e) {
      throw new InternalServerErrorException('Server Error');
    }
  }

  public async findOneAndUpdate(
    data: Partial<Record<keyof T, unknown>>,
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, number> = {},
    options: Record<string, unknown> = { new: true, runValidators: true },
  ) {
    try {
      const result = await this.model
        .findOneAndUpdate(conditions as FilterQuery<T>, data as UpdateQuery<T>, options)
        .select(projection);

      return result;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Server Error');
    }
  }

  public async findOneAndDelete(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, number> = {},
    options: Record<string, unknown> = { new: true, runValidators: true },
  ) {
    try {
      const result = await this.model.findOneAndDelete(conditions as FilterQuery<T>, options).select(projection);

      return result;
    } catch (e) {
      throw new InternalServerErrorException('Server Error');
    }
  }
}
