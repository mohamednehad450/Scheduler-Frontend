import { NextRequest } from "next/server";
import { Cron, Pin, Sequence, SequenceEvent } from "../components/common";
import CronSequence from "./cronSequence";
import { Auth, CRUD, DeviceAction, Events, Page, Pagination } from "./utils";

const BACKEND_BASE_URL = `http://${process.env.BACKEND_URL || "localhost"}:${
  process.env.BACKEND_PORT || "8000"
}`;

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

const NEXT_API_PREFIX = "/api";

const pinsCRUD = new CRUD<Pin["channel"], Pin>(NEXT_API_PREFIX + routes.PIN);
const sequenceCRUD = new CRUD<Sequence["id"], Sequence>(
  NEXT_API_PREFIX + routes.SEQUENCE
);
const cronCRUD = new CRUD<Cron["id"], Cron>(NEXT_API_PREFIX + routes.CRON);
const sequenceEvents = new Events<SequenceEvent["id"], SequenceEvent>(
  NEXT_API_PREFIX + routes.EVENTS.SEQUENCE
);
const cronSequence = new CronSequence(NEXT_API_PREFIX + routes.LINK);
const auth = new Auth(NEXT_API_PREFIX + routes.AUTH);
const deviceAction = new DeviceAction(NEXT_API_PREFIX + routes.ACTION);

const redirect = (slugName: string) => async (req: NextRequest) => {
  const { searchParams, pathname } = new URL(req.url);
  searchParams.delete(slugName); // Remove slug
  const params = searchParams.toString(); // Get remaining params

  const baseUrl = pathname.split(NEXT_API_PREFIX)[1]; // Get backend endpoint by removing the api prefix

  const url = `${BACKEND_BASE_URL}${baseUrl}${params ? "?" + params : ""}`; // complete url

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
  BACKEND_BASE_URL,
  routes,
  redirect,
};
export type { Page, Pagination };
