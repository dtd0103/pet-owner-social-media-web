import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Relationship')
@Controller('api/v1/relationships')
export class RelationshipController {
  constructor(private relationshipService: RelationshipService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAllRelationships() {
    return this.relationshipService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('recommended')
  getRecommendedRelationships(@Req() req: any) {
    return this.relationshipService.getRecommended(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  getRelationshipsByUserId(@Param('id') id: string) {
    return this.relationshipService.getByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Get('friends/:id')
  getFriends(@Param('id') id: string) {
    return this.relationshipService.getFriends(id);
  }

  @UseGuards(AuthGuard)
  @Get('my-friends')
  getMyFriends(@Req() req: any) {
    return this.relationshipService.getFriends(req.user.id);
  }

  @Get('pending/:id')
  async getPendingRequests(@Param('id') id: string) {
    return this.relationshipService.getPendingRequests(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getRelationshipById(@Param('id') id: string) {
    return this.relationshipService.getById(id);
  }

  @UseGuards(AuthGuard)
  @Post('add-friend/:id')
  addFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.sendRequest(req.user.id, id);
  }

  @UseGuards(AuthGuard)
  @Post('accept-friend/:id')
  acceptFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.acceptRequest(req.user.id, id);
  }

  @UseGuards(AuthGuard)
  @Delete('cancel-friend/:id')
  cancelFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.cancelRequest(req.user.id, id);
  }

  @UseGuards(AuthGuard)
  @Delete('reject-friend/:id')
  rejectFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.rejectRequest(req.user.id, id);
  }

  @UseGuards(AuthGuard)
  @Post('block-friend/:id')
  blockFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.blockFriend(req.user.id, id);
  }

  @UseGuards(AuthGuard)
  @Post('unblock-friend/:id')
  unblockFriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.unblockFriend(req.user.id, id);
  }

  @UseGuards(AuthGuard)
  @Delete('unfriend/:id')
  unfriend(@Req() req: any, @Param('id') id: string) {
    return this.relationshipService.removeFriend(req.user.id, id);
  }
}
