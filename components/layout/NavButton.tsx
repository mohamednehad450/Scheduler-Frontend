import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { MouseEventHandler } from "react";

interface MainLinkProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function NavButton({ icon, color, label, onClick }: MainLinkProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[0]
            : theme.colors.dark[8],

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

export default NavButton;
