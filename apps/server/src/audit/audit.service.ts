import { Injectable } from '@nestjs/common'
import { AuditEventType, AuditEventEntity } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log({
    entityId,
    entityType,
    eventType,
    relatedEntityId,
    userId,
    oldValue,
    newValue,
  }: {
    entityId: number
    entityType: AuditEventEntity
    eventType: AuditEventType
    relatedEntityId?: number
    userId: number
    oldValue?: any
    newValue?: any
  }) {
    return this.prisma.auditEvent.create({
      data: {
        entityId,
        entityType,
        eventType,
        relatedEntityId,
        userId,
        oldValue,
        newValue,
      },
    })
  }
}
