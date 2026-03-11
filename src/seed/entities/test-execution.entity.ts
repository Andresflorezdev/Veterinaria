import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestExecutionDocument = HydratedDocument<TestExecution>;

@Schema({ collection: 'test_executions', timestamps: true })
export class TestExecution {
  @Prop({ required: true, enum: ['fast', 'real'] })
  mode: string;

  @Prop({ required: true, enum: ['running', 'passed', 'failed'] })
  status: string;

  @Prop({ required: true })
  command: string;

  @Prop()
  exitCode?: number;

  @Prop()
  durationMs?: number;

  @Prop({ required: true })
  startedAt: Date;

  @Prop()
  finishedAt?: Date;

  @Prop({ default: '' })
  output: string;

  @Prop({ type: Object, default: {} })
  summary: {
    testSuites?: string;
    tests?: string;
  };
}

export const TestExecutionSchema = SchemaFactory.createForClass(TestExecution);