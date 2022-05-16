import { Controller, Get, Post, Body, Patch, Query, Param, Delete, UseInterceptors } from '@nestjs/common'
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

import { UserEntity } from 'src/user/entities/user.entity'
import { OrganisationService } from './organisation.service'
import { CreateOrganisationDto } from './dto/create-organisation.dto'
import { UpdateOrganisationDto } from './dto/update-organisation.dto'
import { Organisation } from './entities/organisation.entity'
import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'

@ApiTags('Organisations')
@Controller('organisation')
@UseInterceptors(PrismaClassSerializerInterceptorPaginated(Organisation))
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Post()
  @ApiCreatedResponse({ type: Organisation })
  create(@Body() createOrganisationDto: CreateOrganisationDto) {
    return this.organisationService.create(createOrganisationDto)
  }

  // @Get()
  // @ApiOkResponse({ type: Organisation, isArray: true })
  // findAll() {
  //   return this.organisationService.findAll()
  // }

  @Get(':id/users')
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(UserEntity)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(UserEntity))
  async findUsers(@Param('id') id: number, @Query() paginationArgs: PaginationArgsDto) {
    return this.organisationService.findUsers(+id, paginationArgs)
  }

  @Get(':id')
  @ApiOkResponse({ type: Organisation })
  findOne(@Param('id') id: string) {
    return this.organisationService.findOne(+id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrganisationDto: UpdateOrganisationDto) {
  //   return this.organisationService.update(+id, updateOrganisationDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.organisationService.remove(+id)
  // }
}
