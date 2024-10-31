import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ListReportDto } from './dto/list-report.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateReportDto } from './dto/update-report.dto';

@ApiBearerAuth()
@ApiTags('Report')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() filterQuery: ListReportDto) {
    return this.reportService.findAll(filterQuery);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getReportById(@Param('id') id: string) {
    return this.reportService.getById(id);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getReportByUser(@Req() req: any) {
    return this.reportService.getByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  async getReportByUserId(@Param('id') id: string) {
    return this.reportService.getByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Get('post/:id')
  async getReportByPost(@Param('id') id: string) {
    return this.reportService.getByPostId(id);
  }

  @UseGuards(AuthGuard)
  @Get('comment/:id')
  async getReportByComment(@Param('id') id: string) {
    return this.reportService.getByCommentId(id);
  }

  @UseGuards(AuthGuard)
  @Post('post/:id')
  async createPostReport(
    @Req() req: any,
    @Param('id') postId: string,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.createPostReport(
      req.user.id,
      postId,
      createReportDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post('user/:id')
  async createUserReport(
    @Req() req: any,
    @Param('id') reportedUserId: string,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.createUserReport(
      req.user.id,
      reportedUserId,
      createReportDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post('comment/:id')
  async createCommentReport(
    @Req() req: any,
    @Param('id') commentId: string,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.createCommentReport(
      req.user.id,
      commentId,
      createReportDto,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async handleReport(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportService.handleReport(id, updateReportDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async removeReport(@Param('id') id: string) {
    return this.reportService.remove(id);
  }
}
