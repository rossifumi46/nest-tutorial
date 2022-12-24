import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import Stripe from 'stripe';
import { UserService } from 'src/user/user.service';

const secret =
  'sk_test_51MCGxlHhbKnhaBi5p0m1wabALKB3l6JHw8f86GtMNlpc8V06A6zqcLobIkml95Bq2Y6hGBOrHAgGDjHep91jglu000agvsK4f6';
const coupon = 'TnouArLm';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.stripe = new Stripe(secret, { apiVersion: '2022-11-15' });
  }

  public async createCustomer(email: string) {
    return this.stripe.customers.create({
      email,
    });
  }

  public async createCheckoutSession(
    priceId: string,
    customerId: string,
    trialUsed: boolean,
  ) {
    const subscriptions = await this.listSubscriptions(customerId);
    if (subscriptions.data.length) {
      throw new BadRequestException('User already subscribed');
    }
    const price = await this.stripe.prices.retrieve(priceId);
    if (!price) {
      throw new BadRequestException('Price not found');
    }
    const {
      recurring: { interval },
    } = price;
    const session = await this.stripe.billingPortal.sessions.create({
      customer: 'cus_MwCrPZsK5p0arD',
      return_url: 'https://example.com/account',
      flow_data: {
        type: 'payment_method_update',
      },
    });
    const { url } = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        'http://moonrise-web-develop.s3-website-us-east-1.amazonaws.com?session_id={{CHECKOUT_SESSION_ID}}',
      cancel_url:
        'http://moonrise-web-develop.s3-website-us-east-1.amazonaws.com?session_id={{CHECKOUT_SESSION_ID}}',
      ...(!trialUsed
        ? {
            subscription_data: {
              trial_period_days: 14,
            },
          }
        : {}),
      ...(!trialUsed && interval === 'year' ? { discounts: [{ coupon }] } : {}),
    });
    return {
      url,
    };
  }

  public async cancelSubscription(customerId: string) {
    const subscsriptions = await this.listSubscriptions(customerId);
    if (!subscsriptions.data.length) {
      throw new BadRequestException('User not subscribed');
    }
    await this.stripe.subscriptions.update(subscsriptions.data[0].id, {
      cancel_at_period_end: true,
    });
    return {
      success: true,
    };
  }

  public async updateSubscription(customerId: string, priceId: string) {
    const subscriptions = await this.listSubscriptions(customerId);
    if (!subscriptions.data.length) {
      throw new BadRequestException('User not subscribed');
    }
    const price = await this.stripe.prices.retrieve(priceId);
    if (!price) {
      throw new BadRequestException('Price not found');
    }
    if (subscriptions.data[0].id === priceId) {
      throw new BadRequestException('This plan already in use');
    }
    await this.stripe.subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: false,
      proration_behavior: 'create_prorations',
      items: [
        {
          id: subscriptions.data[0].items.data[0].id,
          price: priceId,
        },
      ],
    });
    return {
      success: true,
    };
  }

  private async listSubscriptions(customerId: string, priceId?: string) {
    return this.stripe.subscriptions.list({
      customer: customerId,
      price: priceId,
    });
  }

  public async handleWebhook(payload: Buffer, signature: string) {
    const endpointSecret =
      'whsec_33ab01500392adf77f8e9c10643ffb11af3b23569d273ec0a6e413d981db42ec';
    let event: Stripe.Event;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      try {
        event = this.stripe.webhooks.constructEvent(
          payload,
          signature,
          endpointSecret,
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        throw new BadRequestException(
          `⚠️  Webhook signature verification failed. ${err.message}`,
        );
      }
    }

    let subscription: Stripe.Subscription;

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        subscription = event.data.object as Stripe.Subscription;
        const ended_at =
          subscription.status === 'trialing'
            ? subscription.trial_end
            : subscription.current_period_end;
        await this.userService.updateSubscriptionStatus(
          subscription.customer as string,
          subscription.status,
          ended_at,
          true,
          subscription.cancel_at_period_end,
        );
        break;
      case 'customer.subscription.deleted':
        subscription = event.data.object as Stripe.Subscription;
        await this.userService.updateSubscriptionStatus(
          subscription.customer as string,
          subscription.status,
          null,
          true,
          null,
        );
        break;
      case 'customer.subscription.trial_will_end':
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    return;
  }
}
