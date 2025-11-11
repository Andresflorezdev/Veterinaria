import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Owner } from './entities/owner.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OwnerService {
  constructor(@InjectModel(Owner.name) private ownerModel: Model<Owner>) {}

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const createdOwner = new this.ownerModel(createOwnerDto);
    return createdOwner.save();
  }

  async findAll(): Promise<Owner[]> {
    return this.ownerModel.find().exec();
  }

  async findOne(id: string): Promise<Owner> {
    const owner = await this.ownerModel.findById(id).exec();
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return owner;
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    const updateOwner = await this.ownerModel
      .findByIdAndUpdate(id, updateOwnerDto, { new: true })
      .exec();
    if (!updateOwner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return updateOwner;
  }
  async remove(id: string): Promise<Owner> {
    const deletedOwner = await this.ownerModel.findByIdAndDelete(id).exec();
    if (!deletedOwner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return deletedOwner;
  }
}
