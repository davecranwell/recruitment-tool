import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger'

import { PaginationArgsDto, PaginatedDto, ApiPaginatedResponse } from 'src/page/pagination-args.dto'
import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'

import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'

import { ApplicantProfileService } from './applicant-profile.service'
import { CreateApplicantProfileDto } from './dto/create-applicant-profile.dto'
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto'
import { ApplicantProfile } from './entities/applicant-profile.entity'

@ApiBearerAuth('access-token')
@ApiTags('Applicant Profiles')
@Controller('applicant-profile')
@UseGuards(JwtAuthenticationGuard)
@UseInterceptors(PrismaClassSerializerInterceptorPaginated(ApplicantProfile))
export class ApplicantProfileController {
  constructor(private readonly applicantProfileService: ApplicantProfileService) {}

  @Post()
  @ApiCreatedResponse({ type: () => ApplicantProfile })
  // TODO, add RBAC to prevent users creating applicant profiles for other users
  async create(@Body() createApplicantProfileDto: CreateApplicantProfileDto) {
    return this.applicantProfileService.create(createApplicantProfileDto)
  }

  // @Get('')
  // @ApiOkResponse({ type: ApplicantProfile, isArray: true })
  // async findAll() {
  //   return this.applicantProfileService.findAll()
  // }

  @Get('by-user/:userId')
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(ApplicantProfile)
  async findByUser(
    @Param('userId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) userId: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    return this.applicantProfileService.findByUser(+userId, paginationArgs)
  }

  @Get('with-user/:userId')
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(ApplicantProfile)
  async findWithUser(
    @Param('userId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) userId: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    return this.applicantProfileService.findWithUser(+userId, paginationArgs)
  }

  @Get('by-position/:positionId')
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(ApplicantProfile)
  async findByPosition(
    @Param('positionId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) positionId: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    return this.applicantProfileService.findByPosition(+positionId, paginationArgs)
  }

  @Get(':id')
  @ApiOkResponse({ type: () => ApplicantProfile })
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: string) {
    return this.applicantProfileService.findOne(+id)
  }

  // @Patch(':id')
  // @ApiOkResponse({ type: ApplicantProfile })
  // update(@Param('id') id: string, @Body() updateApplicantProfileDto: UpdateApplicantProfileDto) {
  //   return this.applicantProfileService.update(+id, updateApplicantProfileDto)
  // }

  // @Delete(':id')
  // @HttpCode(204)
  // @ApiNoContentResponse()
  // remove(@Param('id') id: string) {
  //   return this.applicantProfileService.remove(+id)
  // }
}
