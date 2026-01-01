import React, { useEffect, useState } from "react";
import { Navbar } from "~/components/navbar";
import { navbarTexts } from "~/props/navbarProps";
import { getUsers, deleteUser, addUser } from "~/node_api/user";
import type { User } from "~/props/userManagementProps";
import { userManagementTexts } from "~/props/userManagementProps";


const addUserButton = "inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95";
const inputClass = "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none";
const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";


export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "view">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Yeni kullanıcı Formu
  const [form, setForm] = useState({
    username: "",
    password: "",
    permission: 2, // 2: User
    email: "",
    tel: "",
    cityID: "",
    address: "",
    job: "",
    warehouseID: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  // UI
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <Navbar {...navbarTexts} />
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* title ve buton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-wider">
              {userManagementTexts.title}
            </h1>
          </div>
          <button onClick={() => {
            setModalMode("add");
            resetForm();
            setShowAddModal(true);
          }} 
                  className={addUserButton}>
                    <span className="text-xl leading-none">+</span>
                    {userManagementTexts.addUser.title}
                  </button>
        </div>
        {/* kullanıcı listesi */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-300 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium"> {userManagementTexts.loading}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-400 text-lg">{userManagementTexts.empty}</p>
            </div>
          ): (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{userManagementTexts.table.username}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{userManagementTexts.table.email}</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{userManagementTexts.table.action}</th>
                </tr>
              </thead>
                <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr
                    key={u.userID}
                      className="group hover:bg-blue-50/40 transition-colors cursor-pointer"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return;
                        setSelectedUser(u);
                        setModalMode("view");
                        setForm({
                          username: u.username || "",
                          password: "",
                          permission: 2,
                          email: u.email || "",
                          tel: u.tel || "",
                          cityID: u.cityID?.toString() || "",
                          address: u.address || "",
                          job: u.job || "",
                          warehouseID: u.warehouseID?.toString() || "",
                        });
                        setShowAddModal(true);
                      }}
                  >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-bold">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-700">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{u.email ?? "-"}</td>
                      <td className="px-6 py-4 text-right">
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(u.userID);
                          }}
                          className="opacity-0 group-hover:opacity-100 px-4 py-2 text-red-500 font-bold rounded-lg hover:bg-red-50 transition-all">
                        {userManagementTexts.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </main>
      {/* Kullanıcı modalı*/}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => {
              setShowAddModal(false);
              resetForm();
              setSelectedUser(null);
              setModalMode("add");
            }} 
          />
          
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-slate-800">
                {modalMode === "add" ? userManagementTexts.addUser.title : userManagementTexts.viewUser.title}
            </h2>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                  setSelectedUser(null);
                  setModalMode("add");
                }} 
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>{userManagementTexts.addUser.username}</label>
              <input
                    className={`${inputClass} ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""}`}
                    placeholder={userManagementTexts.addUser.usernamePlaceholder} 
                value={form.username}
                    onChange={e => setForm({...form, username: e.target.value})}
                    readOnly={modalMode === "view"}
                  />
                </div>
                {modalMode === "add" && (
                  <div>
                    <label className={labelClass}>{userManagementTexts.addUser.password}</label>
              <input
                type="password"
                      className={inputClass} 
                      placeholder={userManagementTexts.addUser.passwordPlaceholder} 
                value={form.password}
                      onChange={e => setForm({...form, password: e.target.value})} 
                    />
                  </div>
                )}
                {modalMode === "view" && (
                  <div>
                    <label className={labelClass}>{userManagementTexts.addUser.userID}</label>
                    <input 
                      className={`${inputClass} bg-slate-100 cursor-not-allowed`}
                      value={selectedUser?.userID || ""} 
                      readOnly
              />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className={labelClass}>{userManagementTexts.addUser.email}</label>
              <input
                type="email"
                    className={`${inputClass} ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""}`}
                    placeholder={userManagementTexts.addUser.emailPlaceholder} 
                value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    readOnly={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className={labelClass}>{userManagementTexts.addUser.tel}</label>
              <input
                type="tel"
                    className={`${inputClass} ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""}`}
                    placeholder={userManagementTexts.addUser.telPlaceholder} 
                value={form.tel}
                    onChange={e => setForm({...form, tel: e.target.value})}
                    readOnly={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className={labelClass}>{userManagementTexts.addUser.job}</label>
                  <input 
                    className={`${inputClass} ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""}`}
                    placeholder={userManagementTexts.addUser.jobPlaceholder} 
                    value={form.job} 
                    onChange={e => setForm({...form, job: e.target.value})}
                    readOnly={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className={labelClass}>{userManagementTexts.addUser.city}</label>
              <input
                type="number"
                    className={`${inputClass} ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""}`}
                value={form.cityID}
                    onChange={e => setForm({...form, cityID: e.target.value})}
                    readOnly={modalMode === "view"}
                  />
                </div>
                <div>
                  <label className={labelClass}>{userManagementTexts.addUser.warehouse}</label>
              <input
                type="number"
                    className={`${inputClass} ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""}`}
                value={form.warehouseID}
                    onChange={e => setForm({...form, warehouseID: e.target.value})}
                    readOnly={modalMode === "view"}
                  />
                </div>
                {modalMode === "add" && (
                  <div className="md:col-span-2">
                    <label className={labelClass}>{userManagementTexts.addUser.permission}</label>
              <select
                      className={inputClass} 
                value={form.permission}
                      onChange={e => setForm({...form, permission: Number(e.target.value)})}
              >
                <option value={1}>{userManagementTexts.permissions.admin}</option>
                <option value={2}>{userManagementTexts.permissions.user}</option>
              </select>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className={labelClass}>{userManagementTexts.addUser.address}</label>
                  <textarea 
                    rows={2} 
                    className={`${inputClass} resize-none ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""}`}
                    value={form.address} 
                    onChange={e => setForm({...form, address: e.target.value})}
                    readOnly={modalMode === "view"}
                  />
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                  setSelectedUser(null);
                  setModalMode("add");
                }}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {modalMode === "add" ? userManagementTexts.addUser.cancel : userManagementTexts.viewUser.close}
              </button>
              {modalMode === "add" && (
              <button
                onClick={handleAddUser}
                  className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                {userManagementTexts.addUser.save}
              </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  // fonksiyonlar
  async function handleDelete(id: number) {
    if(!confirm(userManagementTexts.deleteConfirm)) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      alert(error instanceof Error? error.message : userManagementTexts.deleteError);
    }
  }
  
  function resetForm() {
    setForm({
      username: "",
      password: "",
      permission: 2, // 2: User
      email: "",
      tel: "",
      cityID: "",
      address: "",
      job: "",
      warehouseID: "",
    });
    setSelectedUser(null);
  }

  async function handleAddUser() {
    if( !form.username || !form.password || !form.email || !form.tel || !form.cityID || !form.address || !form.job || !form.warehouseID ) {
      alert(userManagementTexts.addUser.requiredFields);
      return;
    }
    try {
      await addUser({
        ...form,
        cityID: Number(form.cityID),
        warehouseID: Number(form.warehouseID),
      });
      setShowAddModal(false);
      resetForm();
      setModalMode("add");
      fetchUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : userManagementTexts.addUser.error);
    }
  }
}