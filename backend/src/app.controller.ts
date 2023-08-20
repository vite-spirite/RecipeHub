import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';

class TestDTO {
  @ApiProperty()
  id: number
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
