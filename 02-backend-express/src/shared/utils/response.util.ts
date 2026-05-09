import { ServerResponse } from 'http';

export class ResponseUtil {
  static send(res: ServerResponse, statusCode: number, data: any) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  static success(res: ServerResponse, data: any, statusCode = 200) {
    this.send(res, statusCode, data);
  }

  static error(res: ServerResponse, message: string, statusCode = 500) {
    this.send(res, statusCode, { status: 'error', message });
  }
}
