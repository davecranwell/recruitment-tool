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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'

import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'

import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
// TODO fix this renaming
import { UserEntity as User, UserEntity } from './entities/user.entity'

import { RequestWithUser } from 'src/authentication/authentication.controller'
import { Action } from 'src/casl/actions'
import { Organisation } from 'src/organisation/entities/organisation.entity'

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // @ApiCreatedResponse({ type: User })
  // create(@Body() data: CreateUserDto) {
  //   return this.userService.create(data)
  // }

  // Possibly no use for this. Users get access to themselves as their auth response
  // and org admins who maintain users access them via org controller
  // @Get(':id')
  // @UseInterceptors(ClassSerializerInterceptor)
  // @ApiOkResponse({ type: User })
  // async findOne(
  //   @Req() request: RequestWithUser,
  //   @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  // ) {
  //   return this.userService.findOne(id, request.user)
  // }

  // Only user for a user to get a list of their own organisations in detail
  @Get(':id/organisations')
  @ApiCreatedResponse({ type: Organisation, isArray: true })
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Organisation))
  async findUserOrganisations(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  ) {
    const ability = new Ability(request.user.abilities)
    if (!ability.can(Action.Read, new UserEntity({ id }))) throw new ForbiddenException()

    return this.userService.findOrganisations(id, request.user)
  }
}
