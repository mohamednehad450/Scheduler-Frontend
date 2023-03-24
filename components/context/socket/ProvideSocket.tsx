import { FC, PropsWithChildren } from "react";
import { useSocketContext, socketContext } from "./socket";

const ProvideSocket: FC<PropsWithChildren<{}>> = ({ children }) => {
  const value = useSocketContext();

  return (
    <socketContext.Provider value={value}>{children}</socketContext.Provider>
  );
};

export default ProvideSocket;
