import { NextRequest } from "next/server";
import { Cron, Pin, Sequence, SequenceEvent } from "../components/common";
import CronSequence from "./cronSequence";
import { Auth, CRUD, DeviceAction, Events, Page, Pagination } from "./utils";

const routes = {
  SEQUENCE: "/sequence",
  PIN: "/pin",
  CRON: "/cron",
  EVENTS: {
    SEQUENCE: "/event/sequence",
  },
  LINK: "/link",
  AUTH: "/auth",
  ACTION: "/action",
};

const API_PREFIX = "/api";

const pinsCRUD = new CRUD<Pin["channel"], Pin>(API_PREFIX + routes.PIN);
const sequenceCRUD = new CRUD<Sequence["id"], Sequence>(
  API_PREFIX + routes.SEQUENCE
);
const cronCRUD = new CRUD<Cron["id"], Cron>(API_PREFIX + routes.CRON);
const sequenceEvents = new Events<SequenceEvent["id"], SequenceEvent>(
  API_PREFIX + routes.EVENTS.SEQUENCE
);
const cronSequence = new CronSequence(API_PREFIX + routes.LINK);
const auth = new Auth(API_PREFIX + routes.AUTH);
const deviceAction = new DeviceAction(API_PREFIX + routes.ACTION);

// Used to redirect all api request to the backend when developing
const redirect = (slugName: string) => async (req: NextRequest) => {
  const { searchParams, pathname } = new URL(req.url);
  searchParams.delete(slugName); // Remove slug
  const params = searchParams.toString(); // Get remaining params

  const baseUrl = pathname.split(API_PREFIX)[1]; // Get backend endpoint by removing the api prefix

  const DEV_BACKEND_URL = process.env.BACKEND_URL || "";
  const url = `${DEV_BACKEND_URL}${baseUrl}${params ? "?" + params : ""}`; // complete url

  return fetch(url, {
    method: req.method,
    body: req.body,
    headers: req.headers,
    redirect: "manual",
  });
};

export {
  pinsCRUD,
  sequenceCRUD,
  sequenceEvents,
  cronCRUD,
  cronSequence,
  auth,
  deviceAction,
  CRUD,
  Events,
  routes,
  redirect,
};
export type { Page, Pagination };
