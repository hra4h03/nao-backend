resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block_vpc
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.app_name}-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.cidr_block_subnet_public
  availability_zone = "eu-central-1a"

  tags = {
    Name = "${var.app_name}-public-subnet"
  }
}

resource "aws_subnet" "private_ecs" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.cidr_block_subnet_private_ecs
  availability_zone = "eu-central-1a"

  tags = {
    Name = "${var.app_name}-private-ecs-subnet"
  }
}

resource "aws_subnet" "private_docdb_subnet_1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.cidr_block_subnet_private_docdb_1a
  availability_zone = "eu-central-1a"

  tags = {
    Name = "${var.app_name}-private-docdb-subnet-1a"
  }
}

resource "aws_subnet" "private_docdb_subnet_1c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.cidr_block_subnet_private_docdb_1c
  availability_zone = "eu-central-1c"

  tags = {
    Name = "${var.app_name}-private-docdb-subnet-1c"
  }
}

resource "aws_subnet" "private_s3_endpoint" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.cidr_block_subnet_private_s3
  availability_zone = "eu-central-1a"

  tags = {
    Name = "${var.app_name}-private-s3-endpoint-subnet"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.app_name}-igw"
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public.id

  tags = {
    Name = "${var.app_name}-nat-gw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.app_name}-public-rt"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "${var.app_name}-private-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private_ecs" {
  subnet_id      = aws_subnet.private_ecs.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_docdb" {
  subnet_id      = aws_subnet.private_docdb_subnet_1a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_s3_endpoint" {
  subnet_id      = aws_subnet.private_s3_endpoint.id
  route_table_id = aws_route_table.private.id
}
