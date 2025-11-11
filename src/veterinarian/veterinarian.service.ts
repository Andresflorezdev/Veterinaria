import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { UpdateVeterinarianDto } from './dto/update-veterinarian.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Veterinarian,
  VeterinarianDocument,
} from './entities/veterinarian.entity';

@Injectable()
export class VeterinarianService {
  constructor(
    @InjectModel(Veterinarian.name)
    private veterinarianModel: Model<VeterinarianDocument>,
  ) {}

  async create(
    createVeterinarianDto: CreateVeterinarianDto,
  ): Promise<Veterinarian> {
    const createdVeterinarian = new this.veterinarianModel(
      createVeterinarianDto,
    );
    return createdVeterinarian.save();
  }

  async findAll(): Promise<Veterinarian[]> {
    return this.veterinarianModel.find().exec();
  }

  async findOne(id: string): Promise<Veterinarian> {
    const veterinarian = await this.veterinarianModel.findById(id).exec();
    if (!veterinarian) {
      throw new NotFoundException(`Veterinarian with ID ${id} not found`);
    }
    return veterinarian;
  }

  async update(
    id: string,
    updateVeterinarianDto: UpdateVeterinarianDto,
  ): Promise<Veterinarian> {
    const updateVeterinarian = await this.veterinarianModel
      .findByIdAndUpdate(id, updateVeterinarianDto, { new: true })
      .exec();
    if (!updateVeterinarian) {
      throw new NotFoundException(`Veterinarian with ID ${id} not found`);
    }
    return updateVeterinarian;
  }

  async remove(id: string): Promise<Veterinarian> {
    const deletedVeterian = await this.veterinarianModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedVeterian) {
      throw new NotFoundException(`Veterinarian with ID ${id} not found`);
    }
    return deletedVeterian;
  }
}
