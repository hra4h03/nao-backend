import { Transform, TransformOptions } from 'stream';

export class BatchTransform<TChunk = unknown> extends Transform {
  protected batchSize: number;
  protected currentBatch: TChunk[];

  constructor(options: TransformOptions & { batchSize: number }) {
    super(options);
    this.batchSize = options.batchSize;
    this.currentBatch = [];
  }

  _transform(chunk: TChunk, encoding: string, callback: VoidFunction) {
    // Add the new chunk to the current batch
    this.currentBatch.push(chunk);

    // If we've reached the batch size, push the batch and reset
    if (this.currentBatch.length >= this.batchSize) {
      this.push(this.currentBatch);
      this.currentBatch = [];
    }

    callback();
  }

  _flush(callback: VoidFunction) {
    if (this.currentBatch.length > 0) {
      this.push(this.currentBatch);
    }
    callback();
  }
}
