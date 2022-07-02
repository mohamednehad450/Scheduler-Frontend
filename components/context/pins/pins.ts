import { createContext, useContext, useState } from "react";
import { pinsCRUD } from "../../../api";
import { PinDbType } from "../../../Scheduler/src/db";
import { CRUDContext, initCRUDContext } from "../utils";


export const pinsContext = createContext<CRUDContext<PinDbType['channel'], PinDbType> | undefined>(undefined)

export const initPinsContext = () => initCRUDContext(pinsCRUD, (p => p.channel))

export const usePins = () => useContext(pinsContext)