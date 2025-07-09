"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import PropTypes from "prop-types";

export const AuthContext = React.createContext();

export const AuthProvider = ({ session, children }) => {
  return (
    <SessionProvider session={session}>
      <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
    </SessionProvider>
  );
};

AuthProvider.propTypes = {
  session: PropTypes.object,
  children: PropTypes.node,
};
