import React from "react";
import AdminRoute from "../../../components/Protected/AdminRoutes";
import Link from "next/link";

function Admin() {
  return (
    <AdminRoute>
      <h1>Hello Admin User</h1>
    </AdminRoute>
  );
}

export default Admin;
