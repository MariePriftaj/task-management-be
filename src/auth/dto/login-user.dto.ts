import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;

// Menyra 2: shmang perseritjen e fushave (email, password) mes CreateUserDto dhe LoginUserDto:

// import { PickType } from '@nestjs/mapped-types';
// import { CreateUserDto } from '../../users/dto/create-user.dto';
// export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}

}
