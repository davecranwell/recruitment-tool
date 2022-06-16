import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'

import { FindOneDto } from 'src/util/shared.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'

// TODO fix this renaming
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { Organisation } from 'src/organisation/entities/organisation.entity'
import { UserEntity as User, UserEntity } from './entities/user.entity'

import { CaslPermissions } from 'src/casl/casl.permissions'
// import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'

import { Action } from 'src/casl/actions'
import { RequestWithUser } from 'src/authentication/authentication.controller'

@ApiTags('Users')
@UseGuards(JwtAuthenticationGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly caslPermissions: CaslPermissions) {}

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

  // @ApiParam({ name: 'id', type: 'number', required: true })
  @Get(':id')
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(User))
  @ApiOkResponse({ type: User })
  findOne(@Req() request: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const ability = this.caslPermissions.createForUser(request.user)

    if (!ability.can(Action.Read, new UserEntity({ id }))) throw new ForbiddenException()

    return this.userService.findOne(id)
  }

  // Don't really need this as no user should be able to see the organisations of another user
  // and the users own organisations are found as part of their authentication
  // @Get(':id/organisations')
  // @ApiCreatedResponse({ type: Organisation, isArray: true })
  // @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Organisation))
  // async findUserOrganisations(@Param() params: FindOneDto) {
  //   return this.userService.findOrganisations(params)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrganisationDto: UpdateOrganisationDto) {
  //   return this.organisationService.update(+id, updateOrganisationDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.organisationService.remove(+id)
  // }
}
