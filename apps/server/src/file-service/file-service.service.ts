import { Injectable } from '@nestjs/common'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuid4 } from 'uuid'
import { ConfigService } from '@nestjs/config'

type BucketType = 'private' | 'public'

@Injectable()
export class FileServiceService {
  private s3: S3Client

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
    })
  }

  async upload(file: Express.Multer.File, location: BucketType) {
    const fileId = uuid4()
    const Bucket =
      location === 'private'
        ? this.configService.get('AWS_S3_PRIVATE_BUCKET')
        : this.configService.get('AWS_S3_PUBLIC_BUCKET')

    const params = {
      Bucket,
      Key: `originals/${fileId}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: 'max-age=31536000',
    }

    await this.s3.send(new PutObjectCommand(params))

    return {
      key: fileId,
      bucket: Bucket,
    }
  }
}
