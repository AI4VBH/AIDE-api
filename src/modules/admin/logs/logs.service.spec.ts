import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { ElasticClient } from 'shared/elastic/elastic-client';
import { LogsService } from './logs.service';
import { IElasticLogObject } from './models/logs.interfaces';

describe('LogsService', () => {
  let service: LogsService;
  let elasticClient: DeepMocked<ElasticClient>;

  beforeEach(async () => {
    elasticClient = createMock<ElasticClient>();
    service = createMock<LogsService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        { provide: ElasticClient, useValue: elasticClient },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get logs by task', () => {
    it('returns expected result', async () => {
      (elasticClient.search as any).mockResolvedValue(elasticResponseObj);

      const result = await service.getLogByTask('argo-task-1');

      expect(elasticClient.getLogs).toHaveBeenCalled();

      expect(result).toMatchSnapshot();
    });
  });

  const elasticResponseObj: IElasticLogObject = {
    took: 112,
    timed_out: false,
    _shards: {
      total: 235,
      successful: 235,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: {
        value: 21,
        relation: 'eq',
      },
      max_score: 0.094831765,
      hits: [
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'FFRheoMBaINYSMWtqMnV',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '1645',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate: 'Task dispatch event saved {executionId}.',
            RenderedMessage:
              'Task dispatch event saved "04a0cded-6aad-408c-b45d-1852ad54fae3".',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:23.6849023Z'),
            Properties: {
              dllversion: '0.0.0.0',
              EventId: {
                Id: 1001,
                Name: 'TaskDispatchEventSaved',
              },
              enviroment: 'Dev',
              dllName: 'Monai.Deploy.WorkflowManager.TaskManager',
              serviceName: 'MTM',
              Scope: [
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
              ],
              taskId: 'argo-task-1',
              executionId: '04a0cded-6aad-408c-b45d-1852ad54fae3',
              SourceContext:
                'Monai.Deploy.WorkflowManager.TaskManager.Services.TaskDispatchEventService',
              workflowInstanceId: 'a5a00865-a331-481c-9a82-c0c2eee281d6',
              messageId: 'c9687c4a-2043-4cd9-9b33-dd49be2908cb',
              messageType: 'TaskDispatchEvent',
              MachineName: 'mtm-monai-6d7cbf64b7-xdslj',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
            },
            '@timestamp': new Date('2022-09-26T15:19:23.684Z'),
            Level: 'Information',
          },
        },
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'HlRheoMBaINYSMWtrMnu',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '4146',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate:
              'Publishing message to {endpoint}/{virtualHost}. Exchange={exchange}, Routing Key={topic}.',
            RenderedMessage:
              'Publishing message to "rabbitmq.monai"/"monaideploy". Exchange="monaideploy", Routing Key="md.tasks.dispatch".',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:22.9668840Z'),
            Properties: {
              dllversion: '0.0.0.0',
              endpoint: 'rabbitmq.monai',
              enviroment: 'Dev',
              EventId: {
                Id: 10000,
                Name: 'PublshingRabbitMQ',
              },
              dllName: 'Monai.Deploy.WorkflowManager',
              virtualHost: 'monaideploy',
              serviceName: 'MWM',
              Scope: [
                'Message ID=0277e763-316c-4104-aeda-3620e7a642c7. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
                'Correlation ID=e4b06f00-5ce3-4477-86cb-4f3bf20680c2, Payload ID=00000000-1000-0000-0000-000000000000',
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
              ],
              taskId: 'argo-task-1',
              SourceContext:
                'Monai.Deploy.Messaging.RabbitMQ.RabbitMQMessagePublisherService',
              topic: 'md.tasks.dispatch',
              exchange: 'monaideploy',
              MachineName: 'mwm-monai-5786f45d65-9885h',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
              workflowId: '10e8bdb1-e75c-443d-98a6-5477e6384675',
            },
            '@timestamp': new Date('2022-09-26T15:19:22.966Z'),
            Level: 'Information',
          },
        },
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'OVRheoMBaINYSMWtwMla',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '38148',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate: 'Generating Argo workflow template.',
            RenderedMessage: 'Generating Argo workflow template.',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:28.2563475Z'),
            Properties: {
              dllversion: '0.0.0.0',
              EventId: {
                Id: 1003,
                Name: 'GeneratingArgoWorkflow',
              },
              enviroment: 'Dev',
              dllName: 'Monai.Deploy.WorkflowManager.TaskManager',
              serviceName: 'MTM',
              Scope: [
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
              ],
              taskId: 'argo-task-1',
              SourceContext:
                'Monai.Deploy.WorkflowManager.TaskManager.Argo.ArgoPlugin',
              workflowInstanceId: 'a5a00865-a331-481c-9a82-c0c2eee281d6',
              messageId: 'c9687c4a-2043-4cd9-9b33-dd49be2908cb',
              messageType: 'TaskDispatchEvent',
              MachineName: 'mtm-monai-6d7cbf64b7-xdslj',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
              argoNamespace: 'argo',
            },
            '@timestamp': new Date('2022-09-26T15:19:28.256Z'),
            Level: 'Debug',
          },
        },
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'OlRheoMBaINYSMWtwMla',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '38148',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate: 'Creating Argo client with base URL: {baseUrl}.',
            RenderedMessage:
              'Creating Argo client with base URL: "https://argo-server.argo:2746".',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:28.2619000Z'),
            Properties: {
              dllversion: '0.0.0.0',
              EventId: {
                Id: 1006,
                Name: 'CreatingArgoClient',
              },
              enviroment: 'Dev',
              dllName: 'Monai.Deploy.WorkflowManager.TaskManager',
              serviceName: 'MTM',
              Scope: [
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
              ],
              taskId: 'argo-task-1',
              baseUrl: 'https://argo-server.argo:2746',
              SourceContext:
                'Monai.Deploy.WorkflowManager.TaskManager.Argo.ArgoProvider',
              workflowInstanceId: 'a5a00865-a331-481c-9a82-c0c2eee281d6',
              messageId: 'c9687c4a-2043-4cd9-9b33-dd49be2908cb',
              messageType: 'TaskDispatchEvent',
              MachineName: 'mtm-monai-6d7cbf64b7-xdslj',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
              argoNamespace: 'argo',
            },
            '@timestamp': new Date('2022-09-26T15:19:28.261Z'),
            Level: 'Debug',
          },
        },
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'O1RheoMBaINYSMWtwMla',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '38148',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate: 'Start processing HTTP request {HttpMethod} {Uri}',
            RenderedMessage:
              'Start processing HTTP request "GET" https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:28.2769858Z'),
            Properties: {
              dllversion: '0.0.0.0',
              EventId: {
                Id: 100,
                Name: 'RequestPipelineStart',
              },
              enviroment: 'Dev',
              HttpMethod: 'GET',
              dllName: 'Monai.Deploy.WorkflowManager.TaskManager',
              serviceName: 'MTM',
              Uri: 'https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
              Scope: [
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
                'HTTP GET https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
              ],
              taskId: 'argo-task-1',
              SourceContext:
                'System.Net.Http.HttpClient.Argo-Insecure.LogicalHandler',
              workflowInstanceId: 'a5a00865-a331-481c-9a82-c0c2eee281d6',
              messageId: 'c9687c4a-2043-4cd9-9b33-dd49be2908cb',
              messageType: 'TaskDispatchEvent',
              MachineName: 'mtm-monai-6d7cbf64b7-xdslj',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
              argoNamespace: 'argo',
            },
            '@timestamp': new Date('2022-09-26T15:19:28.276Z'),
            Level: 'Information',
          },
        },
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'PFRheoMBaINYSMWtwMla',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '38148',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate: 'Sending HTTP request {HttpMethod} {Uri}',
            RenderedMessage:
              'Sending HTTP request "GET" https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:28.2790058Z'),
            Properties: {
              dllversion: '0.0.0.0',
              EventId: {
                Id: 100,
                Name: 'RequestStart',
              },
              enviroment: 'Dev',
              HttpMethod: 'GET',
              dllName: 'Monai.Deploy.WorkflowManager.TaskManager',
              serviceName: 'MTM',
              Uri: 'https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
              Scope: [
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
                'HTTP GET https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
              ],
              taskId: 'argo-task-1',
              SourceContext:
                'System.Net.Http.HttpClient.Argo-Insecure.ClientHandler',
              workflowInstanceId: 'a5a00865-a331-481c-9a82-c0c2eee281d6',
              messageId: 'c9687c4a-2043-4cd9-9b33-dd49be2908cb',
              messageType: 'TaskDispatchEvent',
              MachineName: 'mtm-monai-6d7cbf64b7-xdslj',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
              argoNamespace: 'argo',
            },
            '@timestamp': new Date('2022-09-26T15:19:28.279Z'),
            Level: 'Information',
          },
        },
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'PVRheoMBaINYSMWtwMla',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '38148',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate:
              'Received HTTP response headers after {ElapsedMilliseconds}ms - {StatusCode}',
            RenderedMessage:
              'Received HTTP response headers after 386.078ms - 200',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:28.6713753Z'),
            Properties: {
              StatusCode: 200,
              dllversion: '0.0.0.0',
              enviroment: 'Dev',
              EventId: {
                Id: 101,
                Name: 'RequestEnd',
              },
              HttpMethod: 'GET',
              dllName: 'Monai.Deploy.WorkflowManager.TaskManager',
              serviceName: 'MTM',
              Uri: 'https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
              Scope: [
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
                'HTTP GET https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
              ],
              taskId: 'argo-task-1',
              ElapsedMilliseconds: 386.078,
              SourceContext:
                'System.Net.Http.HttpClient.Argo-Insecure.ClientHandler',
              workflowInstanceId: 'a5a00865-a331-481c-9a82-c0c2eee281d6',
              messageId: 'c9687c4a-2043-4cd9-9b33-dd49be2908cb',
              messageType: 'TaskDispatchEvent',
              MachineName: 'mtm-monai-6d7cbf64b7-xdslj',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
              argoNamespace: 'argo',
            },
            '@timestamp': new Date('2022-09-26T15:19:28.671Z'),
            Level: 'Information',
          },
        },
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'PlRheoMBaINYSMWtwMla',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '38148',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate:
              'End processing HTTP request after {ElapsedMilliseconds}ms - {StatusCode}',
            RenderedMessage:
              'End processing HTTP request after 398.1257ms - 200',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:28.6737060Z'),
            Properties: {
              StatusCode: 200,
              dllversion: '0.0.0.0',
              enviroment: 'Dev',
              EventId: {
                Id: 101,
                Name: 'RequestPipelineEnd',
              },
              HttpMethod: 'GET',
              dllName: 'Monai.Deploy.WorkflowManager.TaskManager',
              serviceName: 'MTM',
              Uri: 'https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
              Scope: [
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
                'HTTP GET https://argo-server.argo:2746/api/v1/workflow-templates/argo/simple-workflow',
              ],
              taskId: 'argo-task-1',
              ElapsedMilliseconds: 398.1257,
              SourceContext:
                'System.Net.Http.HttpClient.Argo-Insecure.LogicalHandler',
              workflowInstanceId: 'a5a00865-a331-481c-9a82-c0c2eee281d6',
              messageId: 'c9687c4a-2043-4cd9-9b33-dd49be2908cb',
              messageType: 'TaskDispatchEvent',
              MachineName: 'mtm-monai-6d7cbf64b7-xdslj',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
              argoNamespace: 'argo',
            },
            '@timestamp': new Date('2022-09-26T15:19:28.673Z'),
            Level: 'Information',
          },
        },
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'P1RheoMBaINYSMWtwMla',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '38148',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate:
              'Creating Kubernetes client: host={host}, namespace={ns}.',
            RenderedMessage:
              'Creating Kubernetes client: host="https://10.233.0.1:443/", namespace="monai".',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:28.8045840Z'),
            Properties: {
              dllversion: '0.0.0.0',
              EventId: {
                Id: 1007,
                Name: 'CreatingKubernetesClient',
              },
              enviroment: 'Dev',
              ns: 'monai',
              serviceName: 'MTM',
              dllName: 'Monai.Deploy.WorkflowManager.TaskManager',
              Scope: [
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
              ],
              taskId: 'argo-task-1',
              host: 'https://10.233.0.1:443/',
              SourceContext:
                'Monai.Deploy.WorkflowManager.TaskManager.Argo.KubernetesProvider',
              workflowInstanceId: 'a5a00865-a331-481c-9a82-c0c2eee281d6',
              messageId: 'c9687c4a-2043-4cd9-9b33-dd49be2908cb',
              messageType: 'TaskDispatchEvent',
              MachineName: 'mtm-monai-6d7cbf64b7-xdslj',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
              argoNamespace: 'argo',
            },
            '@timestamp': new Date('2022-09-26T15:19:28.804Z'),
            Level: 'Debug',
          },
        },
        {
          _index: 'logstash-2022.09.26',
          _type: '_doc',
          _id: 'QFRheoMBaINYSMWtwMla',
          _score: 0.094831765,
          _source: {
            headers: {
              request_method: 'POST',
              http_version: 'HTTP/1.1',
              content_length: '38148',
              http_accept: null,
              request_path: '/',
              http_user_agent: null,
              http_host: 'logstash.shared:5011',
              content_type: 'application/json',
            },
            MessageTemplate:
              'Generating Kubernetes secrets for accessing artifacts: {name}.',
            RenderedMessage:
              'Generating Kubernetes secrets for accessing artifacts: "argo-task-1".',
            '@version': '1',
            Timestamp: new Date('2022-09-26T15:19:28.8112027Z'),
            Properties: {
              dllversion: '0.0.0.0',
              EventId: {
                Id: 1000,
                Name: 'GeneratingArtifactSecret',
              },
              enviroment: 'Dev',
              name: 'argo-task-1',
              dllName: 'Monai.Deploy.WorkflowManager.TaskManager',
              serviceName: 'MTM',
              Scope: [
                'Message ID=c9687c4a-2043-4cd9-9b33-dd49be2908cb. Application ID=16988a78-87b5-4168-a5c3-2cfc2bab8e54.',
              ],
              taskId: 'argo-task-1',
              SourceContext:
                'Monai.Deploy.WorkflowManager.TaskManager.Argo.ArgoPlugin',
              workflowInstanceId: 'a5a00865-a331-481c-9a82-c0c2eee281d6',
              messageId: 'c9687c4a-2043-4cd9-9b33-dd49be2908cb',
              messageType: 'TaskDispatchEvent',
              MachineName: 'mtm-monai-6d7cbf64b7-xdslj',
              correlationId: 'e4b06f00-5ce3-4477-86cb-4f3bf20680c2',
              argoNamespace: 'argo',
            },
            '@timestamp': new Date('2022-09-26T15:19:28.811Z'),
            Level: 'Debug',
          },
        },
      ],
    },
  };
});