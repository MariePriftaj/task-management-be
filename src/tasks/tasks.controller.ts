import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards  } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
//import { AuthGuard } from '@nestjs/passport';
@UseGuards(JwtAuthGuard) //mbron te gjitha route-t ne kete controller
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAllByUser(req.user.userId);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.tasksService.createForUser(req.user.userId, createTaskDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req) {
    return this.tasksService.updateForUser(req.user.userId, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.tasksService.removeForUser(req.user.userId, id);
  }
}
