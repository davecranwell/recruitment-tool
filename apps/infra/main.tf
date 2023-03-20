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

# Create the S3 bucket
resource "aws_s3_bucket" "bucket" {
  bucket = "applican-public-prod"
}

# resource "aws_s3_bucket_acl" "bucket" {
#   bucket = aws_s3_bucket.bucket.id
#   acl    = "public-read"
# }

resource "aws_s3_bucket_policy" "my_bucket_policy" {
  bucket = aws_s3_bucket.bucket.id
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
            "arn:aws:s3:::${aws_s3_bucket.bucket.id}/*"
          ]
        }
      ]
  })

}

data "archive_file" "aws_lambda_function" {
  type        = "zip"
  source_dir  = "./src"
  output_path = "thumbnail.zip"
}

resource "aws_lambda_permission" "allow_bucket1" {
  statement_id  = "AllowExecutionFromS3Bucket1"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.thumbnail.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.bucket.arn
}

# Create the Lambda function
resource "aws_lambda_function" "thumbnail" {
  function_name    = "thumbnail"
  filename         = data.archive_file.aws_lambda_function.output_path
  source_code_hash = data.archive_file.aws_lambda_function.output_base64sha256
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda.arn
  handler          = "index.handler"

  environment {
    variables = {
      BUCKET_NAME     = aws_s3_bucket.bucket.id
      ORIGINALS_PATH  = "originals"
      THUMBNAILS_PATH = "thumbnails"
    }
  }
}


# Create the IAM role for the Lambda function
resource "aws_iam_role" "lambda" {
  name = "thumbnail-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach the required policies to the IAM role
resource "aws_iam_role_policy_attachment" "lambda" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda.name
}

resource "aws_iam_role_policy_attachment" "s3" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
  role       = aws_iam_role.lambda.name
}

# Configure the S3 bucket to trigger the Lambda function
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.bucket.id


  lambda_function {
    lambda_function_arn = aws_lambda_function.thumbnail.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "/originals"
  }

  depends_on = [
    aws_lambda_permission.allow_bucket1
  ]
}