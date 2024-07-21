variable "app_name" {
  default = "product-processor"
}

variable "environment" {
  default = "production"
}

variable "docdb_password" {
  type      = string
  sensitive = true
}

variable "cidr_block_vpc" {
  default = "10.0.0.0/16"
}

variable "cidr_block_subnet_public" {
  default = "10.0.1.0/24"
}

variable "cidr_block_subnet_private_ecs" {
  default = "10.0.2.0/24"
}

variable "cidr_block_subnet_private_docdb_1a" {
  default = "10.0.3.0/24"
}

variable "cidr_block_subnet_private_docdb_1c" {
  default = "10.0.5.0/24"
}

variable "cidr_block_subnet_private_s3" {
  default = "10.0.4.0/24"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app_repo.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.app_cluster.name
}

output "mongodb_endpoint" {
  value = aws_docdb_cluster.mongodb_cluster.endpoint
}

output "s3_bucket_name" {
  value = aws_s3_bucket.app_bucket.id
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_id" {
  value = aws_subnet.public.id
}

output "private_ecs_subnet_id" {
  value = aws_subnet.private_ecs.id
}

output "private_docdb_subnet_1a_id" {
  value = aws_subnet.private_docdb_subnet_1a.id
}

output "private_docdb_subnet_1c_id" {
  value = aws_subnet.private_docdb_subnet_1c.id
}

output "private_s3_endpoint_subnet_id" {
  value = aws_subnet.private_s3_endpoint.id
}
