import { listEmployees } from "@/server/db/services/employee.service";

export default async function Home() {
  const employees = await listEmployees();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 font-sans p-8">
      <main className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
          Employees
        </h1>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm text-left text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3 text-right">Base Salary</th>
                <th className="px-4 py-3 text-right">Bonus</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {employees.map((emp) => (
                <tr key={emp.id} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{emp.name}</td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3">{emp.department}</td>
                  <td className="px-4 py-3">{emp.country}</td>
                  <td className="px-4 py-3 text-right">
                    {emp.currency} {emp.baseSalary.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {emp.currency} {emp.bonus.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                    {emp.currency} {emp.totalCompensation.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && (
            <p className="text-center py-8 text-zinc-500">No employees found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
