import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Report } from './entities/report.entity';
import { ActivityService } from 'src/activity/activity.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ListReportDto } from './dto/list-report.dto';
import { LogActivityDto } from 'src/activity/dto/log-activity.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    private readonly activityService: ActivityService,
  ) {}

  async findAll(filterQuery: ListReportDto) {
    const currentPage = filterQuery.page || 1;
    const itemsPerPage = filterQuery.itemsPerPage || 10;
    const searchTerm = filterQuery.search || '';
    const skip = itemsPerPage * (currentPage - 1);

    const [reports, totalReports] = await this.reportRepository.findAndCount({
      where: [{ reportReason: Like(`%${searchTerm}%`) }],
      take: itemsPerPage,
      skip: skip,
      select: ['id', 'reportReason', 'reportType', 'reportStatus', 'reporter'],
    });

    const totalPage = Math.ceil(totalReports / itemsPerPage);
    const nextPage =
      Number(currentPage) + 1 <= totalPage ? Number(currentPage) + 1 : null;
    const prePage =
      Number(currentPage) - 1 > 0 ? Number(currentPage) - 1 : null;

    return {
      data: reports,
      totalReports,
      currentPage,
      itemsPerPage,
      totalPage,
      nextPage,
      prePage,
    };
  }

  async getByUserId(userId: string) {
    const reports = await this.reportRepository.find({
      where: { reporter: { id: userId } },
      relations: { reporter: true },
    });

    return reports.map((report) => ({
      id: report.id,
      reportedEntityId: report.reportedEntityId,
      reportType: report.reportType,
      reportReason: report.reportReason,
      reportStatus: report.reportStatus,
      createAt: report.createAt,
      updateAt: report.updateAt,
      reporter: {
        id: report.reporter.id,
        name: report.reporter.name,
        avatar: report.reporter.avatar,
        role: report.reporter.role,
      },
    }));
  }

  async getById(reportId: string) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });
    if (!report)
      throw new HttpException('Report not found.', HttpStatus.NOT_FOUND);

    return {
      id: report.id,
      reportedEntityId: report.reportedEntityId,
      reportType: report.reportType,
      reportReason: report.reportReason,
      reportStatus: report.reportStatus,
      createAt: report.createAt,
      updateAt: report.updateAt,
      reporter: {
        id: report.reporter.id,
        name: report.reporter.name,
        avatar: report.reporter.avatar,
      },
    };
  }

  async getByPostId(postId: string) {
    const reports = await this.reportRepository.find({
      where: { reportedEntityId: postId, reportType: 'Post' },
      relations: { reporter: true },
    });

    return reports.map((report) => ({
      id: report.id,
      reportedEntityId: report.reportedEntityId,
      reportType: report.reportType,
      reportReason: report.reportReason,
      reportStatus: report.reportStatus,
      createAt: report.createAt,
      updateAt: report.updateAt,
      reporter: {
        id: report.reporter.id,
        name: report.reporter.name,
        avatar: report.reporter.avatar,
      },
    }));
  }

  async getByCommentId(commentId: string) {
    const reports = await this.reportRepository.find({
      where: { reportedEntityId: commentId, reportType: 'Comment' },
      relations: { reporter: true },
    });

    return reports.map((report) => ({
      id: report.id,
      reportedEntityId: report.reportedEntityId,
      reportType: report.reportType,
      reportReason: report.reportReason,
      reportStatus: report.reportStatus,
      createAt: report.createAt,
      updateAt: report.updateAt,
      reporter: {
        id: report.reporter.id,
        name: report.reporter.name,
        avatar: report.reporter.avatar,
      },
    }));
  }

  async createPostReport(
    userId: string,
    postId: string,
    createReportDto: CreateReportDto,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    if (!post) throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);

    const report = new Report();
    report.reporter = user;
    report.reportedEntityId = postId;
    report.reportType = 'Post';
    report.reportReason = createReportDto.reason;
    report.reportStatus = 'Pending';

    await this.reportRepository.save(report);

    const logActivityDto: LogActivityDto = {
      actionType: 'create_report',
      objectId: post.id,
      objectType: 'post',
      details: `User ${user.name} reported post ${post.id}.`,
    };
    await this.activityService.logActivity(user, logActivityDto);

    return {
      id: report.id,
      reportedEntityId: report.reportedEntityId,
      reportType: report.reportType,
      reportReason: report.reportReason,
      reportStatus: report.reportStatus,
      createAt: report.createAt,
      updateAt: report.updateAt,
      reporter: {
        id: user.id,
        name: user.name,
        email: user.email,
        tel: user.tel,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async createUserReport(
    userId: string,
    reportedUserId: string,
    createReportDto: CreateReportDto,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const reportedUser = await this.userRepository.findOne({
      where: { id: reportedUserId },
    });

    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    if (!reportedUser)
      throw new HttpException('Reported user not found.', HttpStatus.NOT_FOUND);

    const report = new Report();
    report.reporter = user;
    report.reportedEntityId = reportedUserId;
    report.reportType = 'User';
    report.reportReason = createReportDto.reason;
    report.reportStatus = 'Pending';

    await this.reportRepository.save(report);

    const logActivityDto: LogActivityDto = {
      actionType: 'create_report',
      objectId: reportedUser.id,
      objectType: 'user',
      details: `User ${user.name} reported user ${reportedUser.name}.`,
    };
    await this.activityService.logActivity(user, logActivityDto);

    return {
      id: report.id,
      reportedEntityId: report.reportedEntityId,
      reportType: report.reportType,
      reportReason: report.reportReason,
      reportStatus: report.reportStatus,
      createAt: report.createAt,
      updateAt: report.updateAt,
      reporter: {
        id: user.id,
        name: user.name,
        email: user.email,
        tel: user.tel,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async createCommentReport(
    userId: string,
    commentId: string,
    createReportDto: CreateReportDto,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    if (!comment)
      throw new HttpException('Comment not found.', HttpStatus.NOT_FOUND);

    const report = new Report();
    report.reporter = user;
    report.reportedEntityId = commentId;
    report.reportType = 'Comment';
    report.reportReason = createReportDto.reason;
    report.reportStatus = 'Pending';

    await this.reportRepository.save(report);

    const logActivityDto: LogActivityDto = {
      actionType: 'create_report',
      objectId: comment.id,
      objectType: 'comment',
      details: `User ${user.name} reported comment ${comment.id}.`,
    };
    await this.activityService.logActivity(user, logActivityDto);

    return {
      id: report.id,
      reportedEntityId: report.reportedEntityId,
      reportType: report.reportType,
      reportReason: report.reportReason,
      reportStatus: report.reportStatus,
      createAt: report.createAt,
      updateAt: report.updateAt,
      reporter: {
        id: user.id,
        name: user.name,
        email: user.email,
        tel: user.tel,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async remove(reportId: string) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });
    await this.reportRepository.remove(report);

    const logActivityDto: LogActivityDto = {
      actionType: 'remove_report',
      objectId: reportId,
      objectType: 'report',
      details: `User ${report.reporter.name} removed report ${reportId}.`,
    };
    await this.activityService.logActivity(report.reporter, logActivityDto);

    return { message: 'Report removed successfully' };
  }

  async handleReport(reportId: string, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });

    if (!report) {
      throw new HttpException('Report not found.', HttpStatus.NOT_FOUND);
    }

    report.reportStatus = updateReportDto.status;
    await this.reportRepository.save(report);

    const reporter = await this.userRepository.findOne({
      where: { id: report.reporter.id },
    });

    const logActivityDto: LogActivityDto = {
      actionType: 'handle_report',
      objectId: reportId,
      objectType: 'report',
      details: `User ${reporter.name} handled report ${reportId} with status ${updateReportDto.status}.`,
    };

    await this.activityService.logActivity(report.reporter, logActivityDto);

    return {
      id: report.id,
      reportedEntityId: report.reportedEntityId,
      reportType: report.reportType,
      reportReason: report.reportReason,
      reportStatus: report.reportStatus,
      createAt: report.createAt,
      updateAt: report.updateAt,
      reporter: {
        id: reporter.id,
        name: reporter.name,
        avatar: reporter.avatar,
      },
    };
  }
}
