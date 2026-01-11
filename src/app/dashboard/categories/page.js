"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import CategoriesTable from "@/components/dashboard/categories/CategoriesTable";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Electronics",
      description: "All electronic items",
      active: true,
    },
    {
      id: 2,
      name: "Clothing",
      description: "Men and Women clothes",
      active: false,
    },
  ]);

  return (
    <>
      <PageHeader
        title="Categories"
        onFilterChange={(field, checked) =>
          console.log("Filter:", field, checked)
        }
        actions={[
          {
            label: "Add Category",
            icon: "fal fa-plus",
            className: "alert-success",
            onClick: () => console.log("Add Category"),
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
        <CategoriesTable onEdit={(id) => console.log("Edit category:", id)} onDelete={(id) => console.log("Delete category:", id)} />
      </div>
    </>
  );
}
