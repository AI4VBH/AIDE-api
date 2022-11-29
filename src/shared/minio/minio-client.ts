/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
