import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const DashboardPage = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div>
      <h2>Welcome to Dashboard!</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
