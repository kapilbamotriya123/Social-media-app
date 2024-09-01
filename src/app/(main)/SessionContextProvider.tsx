'use client'

import React, { createContext, useContext } from "react";
import { Session, User } from "lucia";

interface SessionContext {
  user: User,
  session: Session,
}

const SessionContext = createContext<SessionContext | null>(null)

const SessionContextProvider = ({children, value} : React.PropsWithChildren<{value: SessionContext}>) => {
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}
export default SessionContextProvider

export const useSessionContext = () => {
  const context = useContext(SessionContext)
  if(!context) {
    throw new Error('use Session must be used inside SessionContextProvider')
  }
  return context
}