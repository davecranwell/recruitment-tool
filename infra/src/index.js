const AWS = require('aws-sdk')
const sharp = require('sharp')

const s3 = new AWS.S3()

exports.handler = async (event, context) => {
  // Get the bucket and key from the S3 event
  const bucket = event.Records[0].s3.bucket.name
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))

  if (!key.startsWith('originals/')) {
    return
  }

  // Load the image from S3
  const imageObject = await s3.getObject({ Bucket: bucket, Key: key }).promise()
  const image = sharp(imageObject.Body)

  // Create the thumbnail
  // https://sharp.pixelplumbing.com/api-resize#resize
  const thumbnail = await image
    .resize(200, 200, {
      fit: 'inside',
    })
    .toBuffer()

  // Upload the thumbnail back to S3
  const thumbnailKey = key.replace('originals/', 'thumbnails/')
  await s3
    .putObject({
      Bucket: bucket,
      Key: thumbnailKey,
      ContentType: imageObject.ContentType,
      CacheControl: imageObject.CacheControl,
      Body: thumbnail,
    })
    .promise()

  return {
    statusCode: 200,
    body: 'Thumbnail created successfully',
  }
}
