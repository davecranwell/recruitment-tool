import { Injectable } from '@nestjs/common'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuid4 } from 'uuid'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FileServiceService {
  private s3: S3Client

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
    })
  }

  async uploadPublic(file: Express.Multer.File) {
    const fileId = uuid4()
    const params = {
      Bucket: this.configService.get('AWS_PUBLIC_S3_BUCKET'),
      Key: `originals/${fileId}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: 'max-age=31536000',
    }

    await this.s3.send(new PutObjectCommand(params))

    return {
      key: fileId,
      bucket: this.configService.get('AWS_PUBLIC_S3_BUCKET'),
    }
  }
}
