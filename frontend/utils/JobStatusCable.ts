import * as ActionCable from '@rails/actioncable';

type Callbacks = {
  connected?: () => void;
  disconnected?: () => void;
  received?: (data: any) => void;
}

export default class JobStatusCable {
  private jobId: string;
  private channelName: string;
  private consumer: ActionCable.Cable | null = null;
  private subscription: ActionCable.Channel | null = null;
  private callbacks?: Callbacks;

  constructor(jobId: string, channelName: string) {
    this.jobId = jobId;
    this.channelName = channelName;
  }

  connect(callbacks: Callbacks): void {
    this.disconnect();
    this.callbacks = callbacks;

    this.consumer = ActionCable.createConsumer(`ws://localhost:7300/api/cable`);

    this.subscription = this.consumer.subscriptions.create({
        channel: this.channelName,
        job_id: this.jobId
      }, {
        connected: () => this.connected(),
        disconnected: () => this.disconnected(),
        received: (data: string) => this.received(data)
      }
    );
  }

  disconnect(): void {
    if (this.consumer) {
      this.consumer.disconnect();
      this.consumer = null;
      this.subscription = null;
      this.callbacks = undefined;
    }
  }

  private connected(): void {
    console.info(`【${this.jobId}】チャンネルに接続しました。`);
    this.callbacks?.connected?.();
  }

  private disconnected(): void {
    console.log(`【${this.jobId}】チャンネルの接続が切断されました。`);
    this.callbacks?.disconnected?.();
  }

  private received(data: any): void {
    console.log(`【${this.jobId}】データを受信しました:`, data);
    this.callbacks?.received?.(data);
  }
}
