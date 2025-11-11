import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './entities/pet.entity';
import { Model } from 'mongoose';

@Injectable()
export class PetService {
  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const createdPet = new this.petModel(createPetDto);
    return createdPet.save();
  }

  async findAll(): Promise<Pet[]> {
    return this.petModel
      .find()
      .populate('owner')
      .populate('veterinarian')
      .exec();
  }

  async findOne(id: string): Promise<Pet> {
    const pet = await this.petModel
      .findById(id)
      .populate('owner')
      .populate('veterinarian')
      .exec();
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto): Promise<Pet> {
    const updatedPet = await this.petModel
      .findByIdAndUpdate(id, updatePetDto, { new: true })
      .populate('owner')
      .populate('veterinarian')
      .exec();
    if (!updatedPet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return updatedPet;
  }

  async remove(id: string): Promise<Pet> {
    const deletedPet = await this.petModel.findByIdAndDelete(id).exec();
    if (!deletedPet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return deletedPet;
  }

  async exists(id: string): Promise<boolean> {
    const pet = await this.petModel.findById(id).exec();
    return !!pet;
  }
}
