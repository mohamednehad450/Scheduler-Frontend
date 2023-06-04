import {
  Card,
  Center,
  Divider,
  Flex,
  LoadingOverlay,
  Text,
  Title,
} from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TickHandler, useSocket } from "../context";

const DeviceTime: FC = () => {
  const sContext = useSocket();
  const [time, setTime] = useState<Date>();

  const { t } = useTranslation();

  useEffect(() => {
    if (!sContext?.socket) {
      const interval = setInterval(() => {
        sContext?.fallback
          .getTime()
          .then((r) => setTime(new Date(r.data.time)));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }

    const tick: TickHandler = (time: string) => {
      setTime(new Date(time));
    };

    sContext?.socket?.on("tick", tick);
    sContext?.socket?.emit("tick", null, true);

    return () => {
      sContext?.socket?.removeListener("tick", tick);
      sContext?.socket?.emit("tick", null, false);
    };
  }, [sContext?.socket]);

  return (
    <Card h="18rem" shadow="sm" p="0" radius={"md"}>
      <Text p="md" pb="0" weight={500} size="lg">
        {t("device_time")}
      </Text>
      <Divider />
      <Center h={"14rem"}>
        <Flex direction={"column"} align={"center"} justify={"center"}>
          <Text
            sx={(theme) => ({
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[5]
                  : theme.colors.gray[7],
            })}
          >
            {time?.toDateString()}
          </Text>
          <Title>{time?.toLocaleTimeString()}</Title>
        </Flex>
      </Center>
      <LoadingOverlay visible={!time} />
    </Card>
  );
};

export default DeviceTime;
