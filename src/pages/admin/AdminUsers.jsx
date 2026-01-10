import { useEffect, useState } from "react";
import AdminLayout from "../../components/common/AdminLayout";
import {
  getAllUsers,
  toggleUserStatus
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| ADMIN USERS MANAGEMENT PAGE
|--------------------------------------------------------------------------
| - View all users
| - Block / Unblock users
| - Admin only
*/
const AdminUsers = () => {
  // Store users list
  const [users, setUsers] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | FETCH ALL USERS
  |--------------------------------------------------------------------------
  */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data); // backend returns users array
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | BLOCK / UNBLOCK USER
  |--------------------------------------------------------------------------
  */
  const handleBlockToggle = async (userId) => {
    const confirmAction = window.confirm(
      "Are you sure you want to change this user's status?"
    );

    if (!confirmAction) return;

    try {
      await toggleUserStatus(userId); // API call
      fetchUsers(); // refresh users list
    } catch (error) {
      console.error("Block/Unblock failed:", error);
      alert("Action failed. Please try again.");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD USERS ON PAGE LOAD
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          User Management
        </h1>
        <p className="text-gray-500">
          View and manage platform users
        </p>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading users...
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            {/* TABLE HEADER */}
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50"
                >
                  {/* NAME */}
                  <td className="p-3 font-medium">
                    {user.name}
                  </td>

                  {/* EMAIL */}
                  <td className="p-3">
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td className="p-3 capitalize">
                    {user.role}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold
                        ${
                          user.isBlocked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* ACTION BUTTON (FIXED ✅) */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        handleBlockToggle(user._id)
                      }
                      className={`px-3 py-1 text-xs rounded font-semibold
                        ${
                          user.isBlocked
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}

              {/* EMPTY STATE */}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
