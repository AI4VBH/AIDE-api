export class LogsDTO {
  json: LogDTO;

  public static from(dto: Partial<LogsDTO>) {
    const it = new LogsDTO();
    it.json = dto.json;
    return it;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: Logs) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(logs: Logs = null) {
  //   const it = new Logs();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}

export class LogDTO {
  execution_id: string;
  level: string;
  line_no: number;
  logger: string;
  model_name: string;
  model_version: string;
  module: string;
  msg: string;
  thread: string;
  type: string;
  written_at: string;
  written_ts: number;

  public static from(dto: Partial<LogDTO>) {
    const it = new LogDTO();
    it.execution_id = dto.execution_id;
    it.level = dto.level;
    it.line_no = dto.line_no;
    it.logger = dto.logger;
    it.model_name = dto.model_name;
    it.model_version = dto.model_version;
    it.module = dto.module;
    it.msg = dto.msg;
    it.thread = dto.thread;
    it.type = dto.type;
    it.written_at = dto.written_at;
    it.written_ts = dto.written_ts;
    return it;
  }

  // TODO: Implement fromEntity method
  // public static fromEntity(entity: Log) {
  //   return this.from({
  //     task_id: entity.id,
  //   });
  // }

  // TODO: Implement toEntity method
  // public toEntity(log: Log = null) {
  //   const it = new Log();
  //   it.task_id = this.task_id;
  //   return it;
  // }
}
