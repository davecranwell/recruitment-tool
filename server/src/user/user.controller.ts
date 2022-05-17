import { Controller, Get, Post, Body, Patch, Query, Param, Delete, UseInterceptors, ParseIntPipe } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiExtraModels,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger'

import { PaginationArgsDto, PaginatedDto, ApiPaginatedResponse } from 'src/page/pagination-args.dto'
import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'

import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindOneDto } from 'src/util/shared.dto'

// TODO fix this renaming
import { UserEntity as User } from './entities/user.entity'
import { Organisation } from 'src/organisation/entities/organisation.entity'

// import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'

@ApiTags('Users')
@Controller('user')
@UseInterceptors(PrismaClassSerializerInterceptorPaginated(User))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data)
  }

  // @Get()
  // @ApiOkResponse({ type: Organisation, isArray: true })
  // findAll() {
  //   return this.organisationService.findAll()
  // }

  // @Get('')
  // @ApiExtraModels(PaginatedDto)
  // @ApiPaginatedResponse(User)
  // @UseInterceptors(PrismaClassSerializerInterceptorPaginated(User))
  // async findUsers(@Param('id') id: number, @Query() paginationArgs: PaginationArgsDto) {
  //   return this.userService.findUsers(+id, paginationArgs)
  // }

  @Get(':id')
  // @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiOkResponse({ type: User })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
  }

  @Get(':id/organisations')
  @ApiCreatedResponse({ type: Organisation, isArray: true })
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Organisation))
  async findUserOrganisations(@Param() params: FindOneDto) {
    return this.userService.findOrganisations(params)
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
