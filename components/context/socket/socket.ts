import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import type { Pin, Sequence } from "../../../components/common";
import os from "os";
import { useAuth } from "../auth";
import { deviceAction } from "../../../api";

enum ACTIONS {
  RUN = "run",
  STOP = "stop",
  REFRESH = "refresh",
}

type DeviceState = {
  runningSequences: Sequence["id"][];
  channelsStatus: { [key: Pin["channel"]]: boolean };
  reservedPins: { pin: Pin; sequenceId: Sequence["id"] }[];
};

type DeviceStateHandler = (state: Partial<DeviceState>) => void;
type ChannelChangeHandler = (change: DeviceState["channelsStatus"]) => void;
type TickHandler = (dateString: string) => void;

type ErrorObject = {
  action: ACTIONS;
  message: string;
  errName: string;
  args: any[];
};
type SuccessObject = {
  action: ACTIONS;
  message?: string;
  args: any[];
};

type DeviceAction = {
  getState: () => Promise<{ data: DeviceState }>;
  getTime: () => Promise<{ data: { time: string } }>;
  resetDevice: () => Promise<{ data: DeviceState }>;
  run: (
    id: Sequence["id"]
  ) => Promise<{ data: { state: DeviceState; sequence: Sequence } }>;
  stop: (id: Sequence["id"]) => Promise<{ data: DeviceState }>;
};

type SocketContext = {
  url: [string, Dispatch<SetStateAction<string>>];
  socket: Socket | undefined;
  fallback: DeviceAction;
};

const socketContext = createContext<SocketContext | undefined>(undefined);

const useSocket = () => useContext(socketContext);

const useSocketContext = (): SocketContext => {
  const [socket, setSocket] = useState<Socket>();
  const [socketUrl, setSocketUrl] = useState(`http://${os.hostname()}:8000`);
  const auth = useAuth();
  useEffect(() => {
    if (auth?.state !== "signedIn") return;
    const s = io(socketUrl, { auth: { token: auth?.token } });
    s.on("connect", () => {
      setSocket(s);
    });
    s.on("disconnect", () => setSocket(undefined));

    return () => {
      s.close();
      s.removeAllListeners();
      setSocket(undefined);
    };
  }, [auth?.token, auth?.state, socketUrl]);

  return {
    url: [socketUrl, setSocketUrl],
    socket,
    fallback: {
      resetDevice: () => deviceAction.resetDevice(auth?.token || ""),
      getState: () => deviceAction.getState(auth?.token || ""),
      getTime: () => deviceAction.getTime(auth?.token || ""),
      run: (id) => deviceAction.run(id, auth?.token || ""),
      stop: (id) => deviceAction.stop(id, auth?.token || ""),
    },
  };
};

export { useSocket, useSocketContext, socketContext };
export type {
  DeviceState,
  DeviceStateHandler,
  TickHandler,
  ChannelChangeHandler,
  ACTIONS,
  ErrorObject,
  SuccessObject,
};
