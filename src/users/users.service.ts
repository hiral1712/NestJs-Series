import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query?: string) {
    if (query) {
      const rolesArray = this.userRepository.find({
        where: {
          role: query,
        },
      });
      if ((await rolesArray).length === 0)
        throw new NotFoundException('User Role Not Found');
      return await rolesArray;
    }
    return await this.userRepository.find();
  }

  async findeOne(id: number) {
    const user = this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User Not Found');
    return await user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User Not Found');

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async delete(id: number) {
    const removeUser = await this.findeOne(id);
    return await this.userRepository.remove(removeUser);
  }

  //=========================================Static Data==================================================

  private users = [
    {
      id: 1,
      name: 'Hiral Tailor',
      email: 'hiral.tailor@atozinfoway.com',
      role: 'INTERN',
    },
    {
      id: 2,
      name: 'Khushbu Sumara',
      email: 'khushbu.sumara@atozinfoway.com',
      role: 'INTERN',
    },
    {
      id: 3,
      name: 'Nirmal Mistry',
      email: 'nirmal.mistry@atozinfoway.com',
      role: 'ENGINEER',
    },
    {
      id: 4,
      name: 'Hemal Desai',
      email: 'hemal.desai@atozinfoway.com',
      role: 'ENGINEER',
    },
    {
      id: 5,
      name: 'Denish Mistry',
      email: 'denish.mistry@atozinfoway.com',
      role: 'ADMIN',
    },
  ];

  //   findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
  //     if (role) {
  //       const rolesArray = this.users.filter((user) => user.role === role);
  //       if (rolesArray.length === 0)
  //         throw new NotFoundException('User Role Not Found');
  //       return rolesArray;
  //     }
  //     return this.users;
  //   }

  //   create(createUserDto: CreateUserDto) {
  //     const userByHighestId = [...this.users].sort((a, b) => b.id - a.id);
  //     const newUser = {
  //       id: userByHighestId[0].id + 1,
  //       ...createUserDto,
  //     };

  //     this.users.push(newUser);
  //     return newUser;
  //   }

  //   update(id: number, updateUserDto: UpdateUserDto) {
  //     this.users = this.users.map((user) => {
  //       if (user.id === id) {
  //         return { ...user, ...updateUserDto };
  //       }
  //       return user;
  //     });
  //     return this.findeOne(id);
  //   }

  //   delete(id: number) {
  //     const removeUser = this.findeOne(id);
  //     this.users.filter((user) => user.id !== id);
  //     return removeUser;
  //   }
}
