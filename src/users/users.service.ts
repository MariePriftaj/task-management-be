import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  //Krijon një përdorues të ri
 async create(data: Partial<User>): Promise<User> {
  const newUser: User = {
    ...data,
    isActive: true,   // default
    tasks: [],        // default
  } as User;

  return this.userModel.create(newUser);
}

  //Merr të gjithë përdoruesit
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  //Merr një përdorues sipas ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  //Përditëson një përdorues
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  //Fshin një përdorues
  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }

  //Merr një përdorues sipas email-it.
  async findByEmail(email: string) {
  return await this.userModel.findOne({ email }).exec();
}

}
