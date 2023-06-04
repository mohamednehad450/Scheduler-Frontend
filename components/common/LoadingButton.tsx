import { Button, LoadingOverlay, ButtonProps } from "@mantine/core";
import { FC, PropsWithChildren, useState } from "react";

const LoadingButton: FC<
  PropsWithChildren<
    ButtonProps & {
      onClick?: (onDone: () => void) => void;
      confirm?: boolean;
    }
  >
> = (props) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      {...props}
      onClick={() => {
        if (!props.onClick) return;
        setLoading(true);
        props.onClick(() => setLoading(false));
      }}
    >
      {props.children}
      <LoadingOverlay visible={loading} />
    </Button>
  );
};

export default LoadingButton;
