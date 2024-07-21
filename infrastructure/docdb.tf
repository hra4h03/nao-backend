resource "aws_docdb_cluster" "mongodb_cluster" {
  cluster_identifier      = "${var.app_name}-docdb-cluster"
  engine                  = "docdb"
  master_username         = "nao"
  master_password         = var.docdb_password
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot     = true
  vpc_security_group_ids  = [aws_security_group.docdb.id]
  db_subnet_group_name    = aws_docdb_subnet_group.default.name
}

resource "aws_docdb_subnet_group" "default" {
  name       = "${var.app_name}-docdb-subnet-group"
  subnet_ids = [aws_subnet.private_docdb_subnet_1a.id, aws_subnet.private_docdb_subnet_1c.id]
}

resource "aws_docdb_cluster_instance" "mongodb_instance" {
  count              = 1
  identifier         = "${var.app_name}-docdb-instance-${count.index}"
  cluster_identifier = aws_docdb_cluster.mongodb_cluster.id
  instance_class     = "db.t3.medium"
}

resource "aws_security_group" "docdb" {
  name        = "${var.app_name}-docdb-sg"
  description = "Security group for DocumentDB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
