import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  // CREATE task për user specifik
  async createForUser(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      // ✅ konverto dueDate në objekt Date nëse është string
      const dueDate = createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined;
      const newTask = new this.taskModel({ ...createTaskDto, userId, dueDate });
      return await newTask.save();
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error creating task');
    }
  }

  // READ të gjitha task-et për user
  async findAllByUser(userId: string): Promise<Task[]> {
    return await this.taskModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  // UPDATE task të user
  async updateForUser(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    //nëse dueDate është string, ktheje në Date
    if (updateTaskDto.dueDate) {
      updateTaskDto.dueDate = new Date(updateTaskDto.dueDate) as any;
    }
    const updatedTask = await this.taskModel.findOneAndUpdate(
      { _id: taskId, userId },
      updateTaskDto,
      { new: true },
    ).exec();

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found for this user`);
    }

    return updatedTask;
  }

  // DELETE task të user
  async removeForUser(userId: string, taskId: string): Promise<Task> {
    const deletedTask = await this.taskModel.findOneAndDelete({ _id: taskId, userId }).exec();
    if (!deletedTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found for this user`);
    }
    return deletedTask;
  }
}
