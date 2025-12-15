import React, { useEffect, useState } from "react";
import { Navbar } from "~/components/navbar";
import { navbarTexts } from "~/props/navbarProps";
import { getUsers, deleteUser, addUser } from "~/node_api/user";
import type { User } from "~/props/userManagementProps";
import { userManagementTexts } from "~/props/userManagementProps";

export function UserManagement() {
  // Kullanıcı listesi
  const [users, setUsers] = useState<User[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Add User modal açık / kapalı durumu
  const [showAddModal, setShowAddModal] = useState(false);

  // Add User form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    permission: 2, 
    email: "",
    tel: "",
    cityID: "",
    address: "",
    job: "",
    warehouseID: "",
  });

  // form reset fonksiyonu
  const resetForm = () => {
    setForm({
      username: "",
      password: "",
      permission: 2,
      email: "",
      tel: "",
      cityID: "",
      address: "",
      job: "",
      warehouseID: "",
    });
  };

  // backend'den kullanıcıları çeker
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // delete user
  const handleDelete = async (id: number) => {
    if (!confirm(userManagementTexts.deleteConfirm)) return;
    
    try {
      await deleteUser(id);
      // başarılı silme sonrası liste yenilenir
      fetchUsers();
    } catch (error) {
      // hata durumunda kullanıcıya bilgi verilir
      alert(
        error instanceof Error 
          ? error.message 
          : userManagementTexts.deleteError
      );
    }
  };

  /*
   * Kullanıcı ekleme
   * - Zorunlu alanlar kontrol edilir
   * - Başarılıysa modal kapanır
   * - Users yeniden çekilir
   */
  const handleAddUser = async () => {
    // Zorunlu alan kontrolü
    if (
      !form.username ||
      !form.password ||
      !form.email ||
      !form.tel ||
      !form.cityID ||
      !form.address ||
      !form.job ||
      !form.warehouseID
    ) {
      alert(userManagementTexts.addUser.requiredFields);
      return;
    }

    // Username uzunluk kontrolü
    if (form.username.length > 50) {
      alert(userManagementTexts.addUser.usernameTooLong);
      return;
    }

    // Password validasyonu
    const passwordRegex = /^(?=.*[0-9])(?=.*[._])[a-zA-Z0-9._]{8,64}$/;
    if (!passwordRegex.test(form.password)) {
      alert(userManagementTexts.addUser.passwordInvalid);
      return;
    }

    try {
      await addUser({
        username: form.username,
        password: form.password,
        permission: form.permission,
        email: form.email,
        tel: form.tel,
        cityID: Number(form.cityID),
        address: form.address,
        job: form.job,
        warehouseID: Number(form.warehouseID),
      });

      // Modal kapat + form reset
      setShowAddModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      // Hata durumunda kullanıcıya bilgi ver
      alert(
        error instanceof Error
          ? error.message
          : userManagementTexts.addUser.error
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar {...navbarTexts} />

      <main className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {userManagementTexts.title}
            </h1>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              + Add User
            </button>
          </div>

          {/* UI STATE */}
          {loading ? (
            <p className="text-gray-700 font-medium">
              {userManagementTexts.loading}...
            </p>
          ) : users.length === 0 ? (
            <p className="text-gray-600 font-medium">
              {userManagementTexts.empty}
            </p>
          ) : (
            <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">

              <thead className="bg-gray-200 text-gray-900">
                <tr>
                  <th className="p-3 text-left font-semibold">
                    {userManagementTexts.table.id}
                  </th>
                  <th className="p-3 text-left font-semibold">
                    {userManagementTexts.table.username}
                  </th>
                  <th className="p-3 text-left font-semibold">
                    {userManagementTexts.table.email}
                  </th>
                  <th className="p-3 text-left font-semibold">
                    {userManagementTexts.table.action}
                  </th>
                </tr>
              </thead>

              <tbody className="text-gray-800">
                {users.map((u) => (
                  <tr
                    key={u.userID}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{u.userID}</td>
                    <td className="p-3">{u.username}</td>
                    <td className="p-3">{u.email ?? "-"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(u.userID)}
                        className="text-red-700 font-semibold hover:text-red-900 hover:underline"
                      >
                        {userManagementTexts.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </main>
      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-300 my-8">
            <h2 className="text-xl font-extrabold mb-5 text-gray-900">
              {userManagementTexts.addUser.title}
            </h2>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <input
                placeholder={userManagementTexts.addUser.username}
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                maxLength={50}
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-gray-50 border border-gray-400
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-blue-600
                "
              />

              <input
                type="password"
                placeholder={userManagementTexts.addUser.password}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-gray-50 border border-gray-400
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-blue-600
                "
              />
              <p className="text-xs text-gray-500 -mt-2">
                {userManagementTexts.addUser.passwordHint}
              </p>

              <input
                type="email"
                placeholder={userManagementTexts.addUser.email}
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-gray-50 border border-gray-400
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-blue-600
                "
              />

              <input
                type="tel"
                placeholder={userManagementTexts.addUser.tel}
                value={form.tel}
                onChange={(e) =>
                  setForm({ ...form, tel: e.target.value })
                }
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-gray-50 border border-gray-400
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-blue-600
                "
              />

              <input
                type="number"
                placeholder={userManagementTexts.addUser.cityID}
                value={form.cityID}
                onChange={(e) =>
                  setForm({ ...form, cityID: e.target.value })
                }
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-gray-50 border border-gray-400
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-blue-600
                "
              />

              <input
                placeholder={userManagementTexts.addUser.address}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-gray-50 border border-gray-400
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-blue-600
                "
              />

              <input
                placeholder={userManagementTexts.addUser.job}
                value={form.job}
                onChange={(e) =>
                  setForm({ ...form, job: e.target.value })
                }
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-gray-50 border border-gray-400
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-blue-600
                "
              />

              <input
                type="number"
                placeholder={userManagementTexts.addUser.warehouseID}
                value={form.warehouseID}
                onChange={(e) =>
                  setForm({ ...form, warehouseID: e.target.value })
                }
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-gray-50 border border-gray-400
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-blue-600
                "
              />

              <select
                value={form.permission}
                onChange={(e) =>
                  setForm({ ...form, permission: Number(e.target.value) })
                }
                className="
                  w-full px-4 py-2 rounded-lg
                  bg-gray-50 border border-gray-400
                  text-gray-900 font-medium
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-blue-600
                "
              >
                <option value={1}>{userManagementTexts.permissions.admin}</option>
                <option value={2}>{userManagementTexts.permissions.user}</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="
                  px-4 py-2 rounded-lg
                  bg-gray-200 text-gray-900 font-semibold
                  hover:bg-gray-300 transition
                "
              >
                {userManagementTexts.addUser.cancel}
              </button>

              <button
                onClick={handleAddUser}
                className="
                  px-5 py-2 rounded-lg
                  bg-blue-700 text-white font-bold
                  hover:bg-blue-800 transition
                  shadow-md
                  ">
                {userManagementTexts.addUser.save}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
