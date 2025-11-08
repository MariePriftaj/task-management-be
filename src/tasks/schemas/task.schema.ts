import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: ['todo', 'in-progress', 'done'], default: 'todo' })
  status: string;

  @Prop({ type: Date })
  dueDate: Date;

  @Prop({ required: true })
  userId: string; //lidhet me user-in
}

export const TaskSchema = SchemaFactory.createForClass(Task);
