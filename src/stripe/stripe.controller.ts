import { Controller, Post, Body, Req, Headers, HttpCode } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import RequestWithRawBody from './request-with-raw-body.interface';
import RequestWithUser from 'src/auth/request-with-user.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { Put } from '@nestjs/common/decorators';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
    @Req() request: RequestWithUser,
  ) {
    return this.stripeService.createCheckoutSession(
      createCheckoutSessionDto.priceId,
      request.user.stripeCustomerId,
      request.user.trialUsed,
    );
  }

  @Put('cancel-subscription')
  cancelSubscription(@Req() request: RequestWithUser) {
    return this.stripeService.cancelSubscription(request.user.stripeCustomerId);
  }

  @Put('update-subscription')
  updateSubscription(
    @Req() request: RequestWithUser,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.stripeService.updateSubscription(
      request.user.stripeCustomerId,
      updateSubscriptionDto.priceId,
    );
  }

  @HttpCode(200)
  @Public()
  @Post('webhook')
  handleWebhookEvents(
    @Req() request: RequestWithRawBody,
    @Headers('Stripe-Signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(request.rawBody, signature);
  }
}
