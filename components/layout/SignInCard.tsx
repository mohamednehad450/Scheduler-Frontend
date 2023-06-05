import {
  Button,
  Card,
  Center,
  Container,
  Tabs,
  TextInput,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context";

type FormError = {
  username: string;
  password: string;
  confirm: string;
};

const SignInCard = () => {
  const [activeTab, setActiveTab] = useState<string | null>("signIn");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [formError, setFormError] = useState<Partial<FormError>>({});
  const [signError, setSignError] = useState("");

  useEffect(() => {
    setFormError({});
  }, [password, username, confirm]);

  useEffect(() => {
    setUsername("");
    setPassword("");
    setConfirm("");
  }, [activeTab]);

  const auth = useAuth();

  const { t } = useTranslation();

  return (
    <Container>
      {auth?.state === "loading" ? (
        <LoadingOverlay visible={auth?.state === "loading"} />
      ) : (
        <Center>
          <Card shadow="sm" m="lg" radius={"md"} style={{ width: "20rem" }}>
            <Tabs
              value={activeTab}
              onTabChange={(s) => {
                setActiveTab(s);
                setSignError("");
              }}
            >
              <Tabs.List>
                <Tabs.Tab value="signIn">{t("sign_in")}</Tabs.Tab>
                <Tabs.Tab value="register">{t("register")}</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="signIn">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    auth?.login(username, password).catch((err) => {
                      const status = err?.response?.status || 0;
                      if (status === 404) {
                        setFormError((err) => ({
                          ...err,
                          username: t("incorrect_username"),
                        }));
                        return;
                      }
                      if (status === 403) {
                        setFormError((err) => ({
                          ...err,
                          password: t("incorrect_password"),
                        }));
                        return;
                      }
                      if (status === 409) {
                        setActiveTab("register");
                        setSignError(t("admin_not_registered"));
                      }
                    });
                  }}
                >
                  <TextInput
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    mt="xs"
                    type="text"
                    required
                    label={t("username")}
                    error={formError.username}
                  />
                  <TextInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    mt="xs"
                    type="password"
                    required
                    label={t("password")}
                    error={formError.password}
                  />
                  <Text size="sm" mt="xs" color={"red"}>
                    {signError}
                  </Text>
                  <Button my="md" type="submit">
                    {t("sign_in")}
                  </Button>
                </form>
              </Tabs.Panel>
              <Tabs.Panel value="register">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const regex = new RegExp(
                      /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{6,}$/
                    );
                    if (confirm !== password) {
                      setFormError((err) => ({
                        ...err,
                        confirm: t("password_match"),
                      }));
                      return;
                    }
                    if (password.length < 6) {
                      setFormError((err) => ({
                        ...err,
                        password: t("password_short"),
                      }));
                      return;
                    }
                    if (!regex.test(password)) {
                      setFormError((err) => ({
                        ...err,
                        password: t("password_weak"),
                      }));
                      return;
                    }
                    auth?.register(username, password).catch((err) => {
                      const status = err?.response?.status || 0;
                      if (status === 409) {
                        setActiveTab("signIn");
                        setSignError(t("admin_registered"));
                      } else {
                        setSignError(t("unknown_error"));
                      }
                    });
                  }}
                >
                  <TextInput
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    my="xs"
                    type="text"
                    required
                    label={t("username")}
                    error={formError.username}
                  />
                  <TextInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    my="xs"
                    type="password"
                    required
                    label={t("password")}
                    error={formError.password}
                  />
                  <TextInput
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    my="xs"
                    type="password"
                    required
                    label={t("confirm_password")}
                    error={formError.confirm}
                  />
                  <Text size="sm" mt="xs" color={"red"}>
                    {signError}
                  </Text>
                  <Button type="submit" my="md">
                    {t("register")}
                  </Button>
                </form>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Center>
      )}
    </Container>
  );
};

export default SignInCard;
