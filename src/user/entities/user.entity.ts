import { Role } from '../../common/consts/role.enum';
import Stripe from 'stripe';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  businessName: string;

  @Column({
    unique: true,
    nullable: true,
  })
  phone: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @Column()
  public stripeCustomerId: string;

  @Column({ default: false })
  trialUsed: boolean;

  @Column({ nullable: true })
  subscriptionStatus: Stripe.Subscription.Status;

  @Column({ nullable: true })
  current_period_end: number;

  @Column({ nullable: true })
  cancel_at_period_end: boolean;
}
