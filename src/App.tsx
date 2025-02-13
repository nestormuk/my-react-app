import React, { useEffect, useState } from 'react';
import { Employee } from './types/employee';
import { employeeApi } from './services/api';
import { EmployeeForm } from './components/EmployeeForm';
import { Pencil, Trash2, UserPlus, Eye, Download } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch employees';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (employee: Employee) => {
    try {
      setLoading(true);
      await employeeApi.create(employee);
      await fetchEmployees();
      setShowForm(false);
      toast.success('Employee created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create employee';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (employee: Employee) => {
    if (!editingEmployee?.id) return;
    try {
      setLoading(true);
      await employeeApi.update(editingEmployee.id, employee);
      await fetchEmployees();
      setEditingEmployee(null);
      toast.success('Employee updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update employee';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      setLoading(true);
      const response = await employeeApi.delete(id);
      if (response.data.deleted) {
        await fetchEmployees();
        toast.success('Employee deleted successfully');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete employee';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.emailId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowForm(true)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                New Employee
              </button>
              <button 
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xl text-gray-600">
                                {employee.firstName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.emailId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingEmployee(employee)}
                            disabled={loading}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id!)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <button 
                            disabled={loading}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(showForm || editingEmployee) && (
        <EmployeeForm
          onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
          onClose={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
          initialData={editingEmployee || undefined}
          disabled={loading}
        />
      )}
    </div>
  );
}

export default App;