## Description

This is a simple project that uses nestjs monorepo to process and upload products to AWS S3. The project is divided into two parts:

1. Processor: This part of the project is responsible for processing the products and enhancing them using the OpenAI API.
2. Uploader: This part of the project is responsible for uploading the products to AWS S3.

## Installation

```bash
$ pnpm install
```

## Setup

Replace the `.env.example` file with `.env` and fill in the necessary environment variables.

```bash
MONGODB_URI=mongodb://localhost:27017/products
BATCH_SIZE=1000
AWS_ACCESS_KEY_ID=put-your-aws-access-key-id-here
AWS_SECRET_ACCESS_KEY=put-your-aws-secret-access-key-here
AWS_BUCKET_NAME=nao-task
OPEN_AI_API_KEY=put-your-open-ai-api-key-here
ENHANCE_PRODUCT_COUNT=10
```


## Running the app

```bash
## running with docker
$ docker compose up -d
```
```bash
## running locally
# for local development, you need to run the database first
$ docker compose -f docker-compose.db.yaml up -d

$ pnpm start:processor:dev
$ pnpm start:uploader:dev
```

