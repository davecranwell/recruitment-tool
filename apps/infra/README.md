# Installation

1. Follow official instructions for Ubuntu (to use with WSL2): https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli
2. Create IAM role for Admin user: https://blog.gruntwork.io/an-introduction-to-terraform-f17df9c6d180

```bash
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
terraform init
```

Format with `terraform fmt`
Validate with `terraform validate`
