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
      >
        {/* Add Button */}
        <button
          type="button"
          className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={() => console.log("Add Admin")}
        >
          <i className="fal fa-plus"></i>
          <span className="txt ms-2">Add Admin</span>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          className="alert alert-danger rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={() => console.log("Delete")}
        >
          <i className="fal fa-trash"></i>
          <span className="txt ms-2">Delete</span>
        </button>
      </PageHeader>

      {/* Page Content */}
      <div className="mt-4">
        <AdminsTable data={admins} />
      </div>
    </>
  );
}


