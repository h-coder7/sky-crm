"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import AdminsTable from "@/components/dashboard/admins/AdminsTable";

export default function AdminsPage() {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "Ahmed Ali",
      email: "ahmed@test.com",
      active: true,
    },
    {
      id: 2,
      name: "Sara Mohamed",
      email: "sara@test.com",
      active: false,
    },
  ]);

  return (
    <>
      <PageHeader
        title="Admins"
        onFilterChange={(field, checked) =>
          console.log("Filter:", field, checked)
        }
        actions={[
          {
            label: "Add Admin",
            icon: "fal fa-plus",
            className: "alert-success",
            onClick: () => console.log("Add Admin"),
          },
          {
            label: "Delete",
            icon: "fal fa-trash",
            className: "alert-danger",
            onClick: () => console.log("Delete"),
          },
        ]}
      />

      {/* Page Content */}
      <div className="mt-4">
        <AdminsTable data={admins} />
      </div>
    </>
  );
}


