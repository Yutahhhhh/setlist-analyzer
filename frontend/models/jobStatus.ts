import Model from "@/models/model";

const jobTypes = ['audio_genre_train', 'audio_analyze', 'audio_analyze_lyric', ''] as const;
const statesTypes = ['running', 'success', 'failed', ''] as const;
export type JobType = typeof jobTypes[number];
export type JobStatusState = typeof statesTypes[number];

export interface IJobStatus {
  id: number;
  jobId: string;
  jobType: JobType;
  progress: number;
  status: JobStatusState;
  startedAt: string;
  finishedAt: string;
  result: string;
  message: string;
  retryCount: number;
}

export default class JobStatus extends Model {
  id: number = 0;
  jobId: string = '';
  jobType: JobType = '';
  progress: number = 0;
  status: string = '';
  startedAt: Date | null = null;
  finishedAt: Date | null = null;
  result: string = '';
  message: string = '';
  retryCount: number = 0;

  constructor(initValues?: Partial<IJobStatus>) {
    super();
    this.assignValues(initValues);
  }

  get isRunning() {
    return this.status === 'running';
  }

  get isError() {
    return this.status === 'failed';
  }

  get isSuccess() {
    return this.status === 'completed';
  }

  get isFinished() {
    return this.isError || this.isSuccess;
  }

  get exists() {
    return this.status !== '';
  }

  get channelName() {
    switch (this.jobType) {
      case 'audio_genre_train':
        return 'AudioGenreTrainChannel';
      case 'audio_analyze':
        return 'AudioAnalyzeChannel';
      case 'audio_analyze_lyric':
        return 'AudioAnalyzeLyricChannel';
      default:
        return '';
    }
  }

  get currentStateString() {
    switch (this.status) {
      case 'running':
        return '実行中';
      case 'completed':
        return '完了';
      case 'failed':
        return '失敗';
      default:
        return '未実行';
    }
  }

  get currentTypeString() {
    switch (this.jobType) {
      case 'audio_genre_train':
        return 'ジャンル学習';
      case 'audio_analyze':
        return '楽曲登録';
      case 'audio_analyze_lyric':
        return '歌詞解析';
      default:
        return '';
    }
  }

  get progressMessage() {
    return `進捗： ${this.progress}%`
  }
}