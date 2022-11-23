import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ItemBucketMetadata } from 'minio';
import { parseBoolean } from 'shared/util/parseBoolean';
import { Readable } from 'stream';

@Injectable()
export class MinioClient extends Client {
  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      endPoint: config.get<string>('MINIO_HOST'),
      port: parseInt(config.get('MINIO_PORT')),
      useSSL: parseBoolean(config.get('MINIO_USE_SSL')),
      accessKey: config.get<string>('MINIO_ACCESS_KEY'),
      secretKey: config.get<string>('MINIO_SECRET_KEY'),
    });

    this.bucketName = config.get<string>('MINIO_BUCKET');

    const scheme = parseBoolean(config.get('MINIO_USE_SSL')) ? 'https' : 'http';

    this.baseUrl = `${scheme}://${config.get<string>('MINIO_HOST')}:${parseInt(
      config.get('MINIO_PORT'),
    )}`;
  }

  private readonly bucketName: string;
  public readonly baseUrl: string;

  async getPresignedObjectUrl(objectName: string): Promise<string> {
    return await this.presignedGetObject(this.bucketName, objectName, 60 * 60);
  }

  async getObjectByName(objectName: string): Promise<Readable> {
    return await this.getObject(this.bucketName, objectName);
  }

  async getObjectMetadata(objectName: string): Promise<ItemBucketMetadata> {
    const { metaData } = await this.statObject(this.bucketName, objectName);
    return metaData;
  }
}

export class MinoiClientException extends Error {
  constructor(message: string, stack?: string) {
    super(message);

    this.stack = stack;
  }
}
