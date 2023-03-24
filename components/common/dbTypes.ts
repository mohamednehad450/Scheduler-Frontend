/**
 * Model Pin
 *
 */
export type Pin = {
  channel: number;
  label: string;
  onState: string;
};

/**
 * Model Cron
 *
 */
export type BaseCron = {
  id: string;
  cron: string;
  label: string;
};
export type Cron = BaseCron & {
  sequences: {
    id: Sequence["id"];
    name: Sequence["name"];
    active: Sequence["active"];
  }[];
};

/**
 * Model Sequence
 *
 */
type Order = {
  channel: number;
  duration: number;
  offset: number;
};

export type BaseSequence = {
  id: string;
  name: string;
  lastRun?: string;
  active: boolean;
  orders: Order[];
};
export type Sequence = BaseSequence & {
  crons: BaseCron[];
};

/**
 * Model SequenceEvent
 *
 */

type SequenceEventType = "run" | "stop" | "finish" | "activate" | "deactivate";
export const sequenceEventTypes: SequenceEventType[] = [
  "run",
  "stop",
  "finish",
  "activate",
  "deactivate",
];

export type BaseSequenceEvent = {
  id: string;
  date: string;
  sequenceId: BaseSequence["id"];
  eventType: SequenceEventType;
};
export type SequenceEvent = BaseSequenceEvent & {
  sequence: { name: string };
};

/**
 * Model CronSequence
 *
 */
export type CronSequence = {
  cronId: BaseCron["id"];
  sequenceId: BaseSequence["id"];
};
