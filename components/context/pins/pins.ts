import { createContext, useContext, useState } from "react";
import { Pin, pinsCRUD } from "../../../api";
import { CRUDContext, initCRUDContext } from "../utils";


export const pinsContext = createContext<CRUDContext<Pin> | undefined>(undefined)

export const initPinsContext = () => initCRUDContext(pinsCRUD)

export const usePins = () => useContext(pinsContext)