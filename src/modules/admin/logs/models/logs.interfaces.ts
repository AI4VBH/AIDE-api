/* 
These interfaces are based on response object from opensearch/elasticsearch
*/

export interface IShards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export interface ITotal {
  value: number;
  relation: string;
}

export interface IHeaders {
  request_method: string;
  http_version: string;
  content_length: string;
  http_accept?: any;
  request_path: string;
  http_user_agent?: any;
  http_host: string;
  content_type: string;
}

export interface IEventId {
  Id: number;
  Name: string;
}

export interface IProperties {
  dllversion?: string;
  EventId?: IEventId;
  enviroment?: string;
  endpoint?: string;
  virtualHost?: string;
  topic?: string;
  exchange?: string;
  workflowId?: string;
  dllName?: string;
  serviceName?: string;
  Scope?: string[];
  taskId?: string;
  executionId?: string;
  SourceContext?: string;
  workflowInstanceId?: string;
  messageId?: string;
  messageType?: string;
  MachineName?: string;
  correlationId?: string;
  argoNamespace?: string;
  baseUrl?: string;
  HttpMethod?: string;
  Uri?: string;
  StatusCode?: number;
  ElapsedMilliseconds?: number;
  ns?: string;
  host?: string;
  name?: string;
  generateName?: string;
}

export interface ISource {
  headers: IHeaders;
  MessageTemplate: string;
  RenderedMessage: string;
  '@version': string;
  Timestamp: Date;
  Properties: IProperties;
  '@timestamp': Date;
  Level: string;
}

export interface IHit {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: ISource;
}

export interface IHits {
  total: ITotal;
  max_score: number;
  hits: IHit[];
}

export interface IElasticLogObject {
  took: number;
  timed_out: boolean;
  _shards: IShards;
  hits: IHits;
}
