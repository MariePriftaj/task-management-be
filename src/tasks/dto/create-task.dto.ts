import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsDateString, IsIn } from 'class-validator';
//import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['todo', 'in-progress', 'done'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
