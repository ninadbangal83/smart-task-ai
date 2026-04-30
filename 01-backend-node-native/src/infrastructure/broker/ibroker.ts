export interface IBroker {
  init(): Promise<void>;
  publish(queue: string, message: any): Promise<void>;
}
