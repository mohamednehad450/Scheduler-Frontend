import { createContext, useContext, useState } from "react";
import { pinsCRUD } from "../../../api";
import type { PinDbType } from "../../../Scheduler/src/db";
import { CRUDContext, useCRUD } from "../utils";


export const pinsContext = createContext<CRUDContext<PinDbType['channel'], PinDbType> | undefined>(undefined)

export const usePinsCRUD = () => useCRUD(pinsCRUD, (p => p.channel))

export const usePins = () => useContext(pinsContext)