import { Ability } from '@casl/ability'
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'

import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'

// TODO fix this renaming
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { UserEntity as User, UserEntity } from './entities/user.entity'

import { RequestWithUser } from 'src/authentication/authentication.controller'
import { Action } from 'src/casl/actions'

@ApiTags('Users')
@UseGuards(JwtAuthenticationGuard)
@Controller('user')
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

  // @ApiParam({ name: 'id', type: 'number', required: true })
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: User })
  async findOne(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  ) {
    return this.userService.findOne(id, request.user)
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
