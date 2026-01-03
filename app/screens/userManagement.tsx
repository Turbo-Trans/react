import React, { useEffect, useState } from "react";
import { Navbar } from "~/components/navbar";
import { navbarTexts } from "~/props/navbarProps";
import { getUsers, deleteUser, addUser, getCountries, getCities } from "~/node_api/user";
import { getWH } from "~/node_api/warehouse";
import type { User } from "~/props/userManagementProps";
import { userManagementTexts } from "~/props/userManagementProps";
import type { Warehouse } from "~/props/warehouseProps";


const addUserButton = "inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95";
const inputClass = "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none";
const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";


export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "view">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Yeni kullanıcı Formu
  const [form, setForm] = useState({
    username: "",
    password: "",
    permission: 2, // 2: User
    email: "",
    tel: "",
    countryID: "",
    cityID: "",
    address: "",
    job: "",
    warehouseID: "",
  });

  const [countries, setCountries] = useState<Array<{ countryID: number; countryName: string }>>([]);
  const [cities, setCities] = useState<Array<{ cityID: number; cityName: string; countryID: number }>>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  useEffect(() => {
    fetchUsers(currentPage);
    fetchCountries();
    fetchWarehouses();
  }, [currentPage]);

  async function fetchCountries() {
    try {
      const result = await getCountries();
      if (Array.isArray(result)) {
        setCountries(result);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error("Ülkeler çekilirken bir hata meydana geldi:", error);
      setCountries([]);
    }
  }

  async function fetchCitiesForCountry(countryID: number) {
    if (!countryID) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      const result = await getCities(countryID);
      if (Array.isArray(result)) {
        setCities(result);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error("Şehirler çekilirken bir hata meydana geldi:", error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }

  async function fetchWarehouses() {
    setLoadingWarehouses(true);
    try {
      const result = await getWH({});
      if (result.data && Array.isArray(result.data)) {
        setWarehouses(result.data);
      } else {
        setWarehouses([]);
      }
    } catch (error) {
      console.error("Depolar çekilirken bir hata meydana geldi:", error);
      setWarehouses([]);
    } finally {
      setLoadingWarehouses(false);
    }
  }

  // Ülke değişince şehirleri çek
  useEffect(() => {
    if (form.countryID) {
      fetchCitiesForCountry(Number(form.countryID));
    } else {
      setCities([]);
      setForm(prev => ({ ...prev, cityID: "" }));
    }
  }, [form.countryID]);

  async function fetchUsers(page: number = 1) {
    setLoading(true);
    try {
      const response = await getUsers(page, limit);
      setUsers(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotal(response.total || 0);
    } catch {
      setUsers([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  // UI
  return (
    <>
      <Navbar {...navbarTexts} />
      <main className="p-6 md:p-10 bg-[#f1f5f9] min-h-screen">
        <div className="max-w-7xl mx-auto">
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
                      onClick={async (e) => {
                        if ((e.target as HTMLElement).closest('button')) return;
                        setSelectedUser(u);
                        setModalMode("view");
                        
                        let countryID = "";
                        if (u.cityID) {
                          try {
                            const allCountries = await getCountries();
                            if (Array.isArray(allCountries)) {
                              for (const country of allCountries) {
                                try {
                                  const cityList = await getCities(country.countryID);
                                  if (Array.isArray(cityList)) {
                                    const foundCity = cityList.find(c => c.cityID === u.cityID);
                                    if (foundCity) {
                                      countryID = country.countryID.toString();
                                      setCities(cityList);
                                      break;
                                    }
                                  }
                                } catch (err) {
                                }
                              }
                            }
                          } catch (err) {
                            console.error("Error finding country for city:", err);
                          }
                        }
                        
                        setForm({
                          username: u.username || "",
                          password: "",
                          permission: 2,
                          email: u.email || "",
                          tel: u.tel || "",
                          countryID: countryID,
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
          
          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600 font-medium">
                Toplam <span className="font-bold text-slate-900">{total}</span> kullanıcıdan{" "}
                <span className="font-bold text-slate-900">
                  {(currentPage - 1) * limit + 1}
                </span>
                {" - "}
                <span className="font-bold text-slate-900">
                  {Math.min(currentPage * limit, total)}
                </span>
                {" arası gösteriliyor"}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 active:scale-95"
                >
                  Önceki
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm min-w-[40px] transition-all ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                        } active:scale-95`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 active:scale-95"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </main>
      {/* Kullanıcı modalı*/}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
                  <label className={labelClass}>Ülke</label>
                  <select
                    className={`${inputClass} ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""}`}
                    value={form.countryID}
                    onChange={e => {
                      setForm({...form, countryID: e.target.value, cityID: ""});
                    }}
                    disabled={modalMode === "view"}
                  >
                    <option value="">Ülke Seçin</option>
                    {countries.map(country => (
                      <option key={country.countryID} value={country.countryID}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{userManagementTexts.addUser.city}</label>
                  <select
                    className={`${inputClass} ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""} ${loadingCities ? "opacity-50" : ""}`}
                    value={form.cityID}
                    onChange={e => setForm({...form, cityID: e.target.value})}
                    disabled={modalMode === "view" || !form.countryID || loadingCities}
                  >
                    <option value="">Şehir Seçin</option>
                    {cities.map(city => (
                      <option key={city.cityID} value={city.cityID}>
                        {city.cityName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>{userManagementTexts.addUser.warehouse}</label>
                  <select
                    className={`${inputClass} ${modalMode === "view" ? "bg-slate-100 cursor-not-allowed" : ""} ${loadingWarehouses ? "opacity-50" : ""}`}
                    value={form.warehouseID}
                    onChange={e => setForm({...form, warehouseID: e.target.value})}
                    disabled={modalMode === "view" || loadingWarehouses}
                  >
                    <option value="">Depo Seçin</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.warehouseID} value={warehouse.warehouseID}>
                        {warehouse.warehouseName}
                      </option>
                    ))}
                  </select>
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
    </>
  );
  // fonksiyonlar
  async function handleDelete(id: number) {
    if(!confirm(userManagementTexts.deleteConfirm)) return;
    try {
      await deleteUser(id);
      fetchUsers(currentPage);
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
      countryID: "",
      cityID: "",
      address: "",
      job: "",
      warehouseID: "",
    });
    setSelectedUser(null);
    setCities([]);
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
      fetchUsers(currentPage);
    } catch (error) {
      alert(error instanceof Error ? error.message : userManagementTexts.addUser.error);
    }
  }
}