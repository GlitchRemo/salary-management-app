"use client";

import { useEffect } from "react";

export default function HomePage(): React.JSX.Element {
  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => {
        console.log("Employees from DB:", data);
      });
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>ACME Salary Management</h1>
      <p>Hello World. Open the browser console to see employee data from the database.</p>
    </main>
  );
}
