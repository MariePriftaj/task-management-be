import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // signup (krijimi i përdoruesit të ri)
  async signup(createUserDto: CreateUserDto) {
    const { email, password, fullName } = createUserDto;

    // kontrollo nëse ekziston përdorues me të njëjtin email
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // kripto password-in
    const hashedPassword = await bcrypt.hash(password, 10);

    // krijo user në db
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      fullName,
      isActive: true,
      tasks: [],
    });

    // krijo payload për JWT
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      access_token: token, // shtohet menjëherë për login automatik
    };
  }

  // LOGIN ekzistues
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}