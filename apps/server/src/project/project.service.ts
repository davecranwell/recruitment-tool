import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PaginatedDto, PaginationArgsDto } from 'src/page/pagination-args.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { createPaginator } from 'src/util/pagination'
import { Action } from 'src/casl/actions'

import { Project } from 'src/project/entities/project.entity'

const paginate = createPaginator({ perPage: 20 })

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
}
