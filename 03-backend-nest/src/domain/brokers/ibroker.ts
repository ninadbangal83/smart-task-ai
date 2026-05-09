export interface IBroker {
  connect(): Promise<void>;
  publish(topic: string, message: any): Promise<void>;
  disconnect(): Promise<void>;
}
