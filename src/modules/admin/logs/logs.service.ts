import { Injectable } from '@nestjs/common';
import { LogsDTO } from './log.dto';

@Injectable()
export class LogsService {
  getLog(): LogsDTO[] {
    return [
      {
        json: {
          execution_id: 'cb134bcb-6993-48a2-8d57-c1c5467ce9dc',
          level: 'INFO',
          line_no: 364,
          logger: 'aide.messaging.consumer',
          model_name: 'test-model-reporter',
          model_version: '1.0.0',
          module: 'consumer',
          msg: "Received message # 2: b'origin studyUID 1.2.276.0.50.192168001092.11156604.14547392.4, series: [{SpecificCharacterSet: ISO_IR 100, ImageType: ORIGINAL, PRIMARY, M_SE, M, SE], InstanceCreationDate: 20060323, InstanceCreationTime: 173526, InstanceCreatorUID: 1.3.46.670589.11.5526.5, SOPClassUID: 1.2.840.10008.5.1.4.1.1.104.1, SOPInstanceUID: 1.2.826.0.1.3680043.8.498.11238653988905808888907601789223505923, StudyDate: 20010101",
          thread: 'Thread-7',
          type: 'log',
          written_at: '2022-05-03T14:28:56.374Z',
          written_ts: 1651588136374477000,
        },
      },
    ];
  }
}
