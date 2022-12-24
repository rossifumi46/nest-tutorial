import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from 'src/common/consts/role.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchQueryDto } from 'src/common/dto/search-query.dto';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => StripeService))
    private stripeService: StripeService,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({
      where: [
        {
          email: createUserDto.email,
        },
        { phone: createUserDto.phone },
      ],
    });
    if (userExist) {
      throw new BadRequestException(`User already exist`);
    }

    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const stripeCustomer = await this.stripeService.createCustomer(
      createUserDto.email,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hash,
      role: Role.User,
      stripeCustomerId: stripeCustomer.id,
    });
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log(typeof id);
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    return this.userRepository.remove(user);
  }

  search(searchQuery: SearchQueryDto) {
    const { query, limit, offset } = searchQuery;
    return this.userRepository.find({
      where: [
        {
          firstName: ILike(`%${query}%`),
        },
        {
          lastName: ILike(`%${query}%`),
        },
      ],
      skip: offset,
      take: limit,
    });
  }

  async updateSubscriptionStatus(
    stripeCustomerId: string,
    subscriptionStatus: Stripe.Subscription.Status,
    current_period_end?: number,
    trialUsed?: boolean,
    cancel_at_period_end?: boolean,
  ) {
    return this.userRepository.update(
      { stripeCustomerId },
      {
        subscriptionStatus,
        current_period_end,
        trialUsed,
        cancel_at_period_end,
      },
    );
  }
}
