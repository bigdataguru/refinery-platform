terraform {
  required_version = "~> 0.10"

  backend "s3" {
    key                  = "terraform.tfstate"
    workspace_key_prefix = "sites"
  }
}

provider "aws" {
  version = "~> 1.0"
  region  = "${var.region}"
}

module "object_storage" {
  source           = "../modules/s3"
  bucket_name_base = "${terraform.workspace}"
}

module "identity_pool" {
  source                   = "../modules/cognito"
  identity_pool_name       = "${var.identity_pool_name}"
  upload_bucket_name       = "${module.object_storage.upload_bucket_name}"
  iam_resource_name_prefix = "${terraform.workspace}"
}

module "docker_host" {
  source              = "../modules/docker_host"
  name                = "${var.name}"
  vpc_cidr_block      = "${var.vpc_cidr_block}"
  private_subnet_id   = "${module.vpc.private_subnet_id}"
  vpc_id              = "${module.vpc.vpc_id}"
  security_group_name = "${terraform.workspace}-docker"
  key_name            = "${var.key_name}"
}

module "refinery_host" {
  source              = "../modules/refinery_host"
  name                = "${var.name}"
  public_cidr_block   = "${var.public_cidr_block}"
  public_subnet_id    = "${module.vpc.public_subnet_id}"
  vpc_id              = "${module.vpc.vpc_id}"
  security_group_name = "${terraform.workspace}-refinery"
  refinery_host_count = "${var.refinery_host_count}"
  key_name            = "${var.key_name}"
  docker_hostname     = "${module.docker_host.docker_hostname}"
}

module "vpc" {
  source             = "../modules/vpc"
  name               = "${var.name}"
  vpc_cidr_block     = "${var.vpc_cidr_block}"
  public_cidr_block  = "${var.public_cidr_block}"
  private_cidr_block = "${var.private_cidr_block}"
  public_cidr_block  = "${var.public_cidr_block}"
  availability_zone  = "${var.availability_zone}"
}
