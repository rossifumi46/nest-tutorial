import { Controller, Get, Post, Redirect, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index() {
    return { articles: [] };
  }

  @Post('articles')
  @Redirect('/', 301)
  create(@Body() body: any): void {
    // const id = articles.length + 1;
    // const article = new Article(body.title, body.content, id);
    // articles.push(article);
  }
}
