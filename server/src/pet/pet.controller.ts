import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PetService } from './pet.service';
import { ListPetDto } from './dto/list-pet.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('Pet')
@Controller('api/v1/pets')
export class PetController {
  constructor(private petService: PetService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAllPet(@Query() filterQuery: ListPetDto) {
    return this.petService.findAll(filterQuery);
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  getUserPet(@Req() req: any) {
    return this.petService.getByUserId(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  getPetByUserId(@Param('id') id: string) {
    return this.petService.getByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOnePet(@Param('id') id: string) {
    return this.petService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = [
          '.jpg',
          '.png',
          '.jpeg',
          '.gif',
          '.bmp',
          '.svg',
          '.webp',
          '.tiff',
          '.psd',
          '.raw',
          '.heif',
          '.indd',
          '.jpeg 2000',
          '.pdf',
        ];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  createPet(
    @Req() req: any,
    @Body() createPetDto: CreatePetDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(req.user.id);
    return this.petService.create(req.user.id, createPetDto, file);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = [
          '.jpg',
          '.png',
          '.jpeg',
          '.gif',
          '.bmp',
          '.svg',
          '.webp',
          '.tiff',
          '.psd',
          '.raw',
          '.heif',
          '.indd',
          '.jpeg 2000',
          '.pdf',
        ];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  updatePet(
    @Req() req: any,
    @Body() updatePetDto: UpdatePetDto,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.petService.update(req.user.id, id, updatePetDto, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  removePet(@Req() req: any, @Param('id') id: string) {
    return this.petService.remove(req.user.id, id);
  }
}
