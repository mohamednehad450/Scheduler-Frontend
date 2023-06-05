import LinkCronModal from "./LinkCronModal";
import SequenceModal from "./SequenceModal";
import CronModal from "./CronModal";
import LinkSequenceModal from "./LinkSequenceModal";
import PinModal from "./PinModal";
import SocketURLModal from "./SocketURLModal";

const modals = {
  PinModal,
  SocketURLModal,
  CronModal,
  SequenceModal,
  LinkCronModal,
  LinkSequenceModal,
};

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

export { modals };
