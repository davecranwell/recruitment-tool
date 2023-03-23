terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-north-1"
}

resource "aws_s3_bucket" "bucket_dev_public" {
  bucket = "applican-public-dev"
}

resource "aws_s3_bucket_policy" "dev_bucket_policy" {
  bucket = aws_s3_bucket.bucket_dev_public.id
  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Principal" : "*",
          "Action" : [
            "s3:GetObject"
          ],
          "Resource" : [
            "arn:aws:s3:::${aws_s3_bucket.bucket_dev_public.id}/*"
          ]
        }
      ]
  })
}

resource "aws_iam_policy" "dev_thumbnail_s3_policy" {
  name = "dev_thumbnail_s3_policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : "s3:GetObject",
        "Resource" : "arn:aws:s3:::${aws_s3_bucket.bucket_dev_public.id}/*"
      },
      {
        "Effect" : "Allow",
        "Action" : "s3:PutObject",
        "Resource" : "arn:aws:s3:::${aws_s3_bucket.bucket_dev_public.id}/*"
      }
    ]
  })
}

resource "aws_iam_role" "thumbnail_lambda_role" {
  name = "thumbnail_lambda_role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [{
      "Effect" : "Allow",
      "Principal" : {
        "Service" : "lambda.amazonaws.com"
      },
      "Action" : "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy_attachment" "thumbnail_role_s3_policy_attachment" {
  name       = "thumbnail_role_s3_policy_attachment"
  roles      = [aws_iam_role.thumbnail_lambda_role.name]
  policy_arn = aws_iam_policy.dev_thumbnail_s3_policy.arn
}

resource "aws_iam_policy_attachment" "thumbnail_role_lambda_policy_attachment" {
  name       = "thumbnail_role_lambda_policy_attachment"
  roles      = [aws_iam_role.thumbnail_lambda_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "aws_lambda_function" {
  type        = "zip"
  source_dir  = "./src"
  output_path = "thumbnail.zip"
}

# # Create the Lambda function
resource "aws_lambda_function" "thumbnail" {
  function_name    = "thumbnail"
  filename         = data.archive_file.aws_lambda_function.output_path
  source_code_hash = data.archive_file.aws_lambda_function.output_base64sha256
  runtime          = "nodejs16.x"
  role             = aws_iam_role.thumbnail_lambda_role.arn
  handler          = "index.handler"
  timeout          = 60
  memory_size      = 128
}

resource "aws_lambda_permission" "thumbnail_allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.thumbnail.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.bucket_dev_public.arn
}

resource "aws_s3_bucket_notification" "thumbnail_notification" {
  bucket = aws_s3_bucket.bucket_dev_public.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.thumbnail.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "originals/"
  }

  depends_on = [
    aws_lambda_permission.thumbnail_allow_bucket
  ]
}
