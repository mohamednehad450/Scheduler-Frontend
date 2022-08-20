import { createContext, useContext } from "react";
import { scheduleCRUD } from "../../../api";
import type { ScheduleDbType } from "../../../Scheduler/src/db";
import { CRUDContext, useCRUD } from "../utils";


export const schedulesContext = createContext<CRUDContext<ScheduleDbType['id'], ScheduleDbType> | undefined>(undefined)

export const useSchedulesCRUD = () => useCRUD(scheduleCRUD, (s) => s.id)

export const useSchedule = () => useContext(schedulesContext)