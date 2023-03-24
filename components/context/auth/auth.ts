import { createContext, useContext, useEffect, useState } from "react";
import { auth, cronSequence, CRUD, Events, Page } from "../../../api";
import { Cron, Sequence } from "../../common";

interface AuthContext {
  token: string;
  username: string;
  state: "loading" | "signedIn" | "signedOut";
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
}

const authContext = createContext<AuthContext | undefined>(undefined);

const useAuth = () => useContext(authContext);

const useAuthContext = (): AuthContext | undefined => {
  const [token, setToken] = useState<AuthContext["token"]>("");
  const [username, setUsername] = useState<AuthContext["username"]>("");
  const [state, setState] = useState<AuthContext["state"]>("loading");

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    const username = localStorage.getItem("username") || "";

    if (!token || !username) {
      setState("signedOut");
      return;
    }
    auth
      .validate(token)
      .then(() => {
        setState("signedIn");
        setUsername(username);
        setToken(token);
      })
      .catch(() => setState("signedOut"));
  }, []);

  useEffect(() => {
    token && localStorage.setItem("token", token);
    username && localStorage.setItem("username", username);
  }, [username, token]);

  const login = async (username: string, password: string) => {
    return auth.login({ username, password }).then((d) => {
      setState("signedIn");
      setUsername(d.data.username);
      setToken(d.data.token);
    });
  };

  const logout = () => {
    setState("signedOut");
    setToken("");
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("token");
  };

  const register = async (username: string, password: string) => {
    return auth.register({ username, password }).then((d) => {
      setState("signedIn");
      setUsername(d.data.username);
      setToken(d.data.token);
    });
  };

  return {
    token,
    username,
    state,
    login,
    logout,
    register,
  };
};

const useCRUDWithAuth = <K, T>(crud: CRUD<K, T>) => {
  const auth = useAuth();

  if (!auth || auth.state !== "signedIn") return;

  const token = auth.token;

  return {
    list: () => crud.list(token),
    get: (id: K) => crud.get(id, token),
    set: (id: K, obj: any) => crud.set(id, obj, token),
    add: (obj: any) => crud.add(obj, token),
    update: (id: K, obj: any) => crud.update(id, obj, token),
    remove: (id: K) => crud.remove(id, token),
  };
};

const useEventsWithAuth = <K, T>(events: Events<K, T>) => {
  const auth = useAuth();

  if (!auth || auth.state !== "signedIn") return;

  const token = auth.token;

  return {
    deleteAll: () => events.deleteAll(token),
    deleteById: (id: K) => events.deleteById(id, token),
    listAll: (page?: Page) => events.listAll(token, page),
    listById: (id: K, page?: Page) => events.listById(id, token, page),
  };
};

const useCronSequenceWithAuth = (cs: typeof cronSequence) => {
  const auth = useAuth();

  if (!auth || auth.state !== "signedIn") return;

  const token = auth.token;

  return {
    linkCron: (id: Cron["id"], sequencesIds: Sequence["id"][]) =>
      cs.linkCron(id, sequencesIds, token),
    linkSequence: (id: Sequence["id"], cronsIds: Cron["id"][]) =>
      cs.linkSequence(id, cronsIds, token),
  };
};

export {
  useAuth,
  useCRUDWithAuth,
  useEventsWithAuth,
  useCronSequenceWithAuth,
  useAuthContext,
  authContext,
};
