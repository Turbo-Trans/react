import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "~/components/navbar";
import { navbarTexts } from "~/props/navbarProps";
import { warehouseTexts, type Warehouse } from "~/props/warehouseProps";
import { addWH, deleteWH, editWH, getWH } from "~/node_api/warehouse";

type ModalMode = "add" | "edit";

export function WarehouseManagement() {
  // stateler
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filtreleme
  const [draftId, setDraftId] = useState("");
  const [draftName, setDraftName] = useState("");
  const [appliedId, setAppliedId] = useState<number | undefined>(undefined);
  const [appliedName, setAppliedName] = useState<string | undefined>(undefined);

  // pagination
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // modal ve form
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [activeWarehouse, setActiveWarehouse] = useState<Warehouse | null>(null);
  const [form, setForm] = useState({
    warehouseName: "",
    warehouseCityID: "",
    warehouseAddress: "",
  });

  // formu resetle
  const resetForm = () => {
    setForm({
      warehouseName: "",
      warehouseCityID: "",
      warehouseAddress: "",
    });
  };

  // yeni depo ekleme
  const openAdd = () => {
    setModalMode("add");
    setActiveWarehouse(null);
    resetForm();
    setShowModal(true);
  };

  // depo editleme
  const openEdit = (w: Warehouse) => {
    setModalMode("edit");
    setActiveWarehouse(w);
    setForm({
      warehouseName: w.warehouseName ?? "",
      warehouseCityID: "",
      warehouseAddress: w.warehouseAddress ?? "",
    });
    setShowModal(true);
  };

  // filtre 
  const appliedQueryKey = useMemo(
    () => `${appliedId ?? ""}|${appliedName ?? ""}|${pageNo}`,
    [appliedId, appliedName, pageNo]
  );

  // depo listesini çek
  const fetchWarehouses = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWH({
        id: appliedId,
        name: appliedName,
        pageNo,
      });

      setWarehouses(data.data ?? []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : warehouseTexts.errors.fetch;

      // backende depo yok durumu
      if (message === warehouseTexts.backend.emptyListMessage) {
        setWarehouses([]);
        setTotalPages(1);
        setTotal(0);
        setError(null);
      } else {
        setError(message || warehouseTexts.errors.generic);
        setWarehouses([]);
        setTotalPages(1);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // filtre veya sayfa değişince listeyi yenile
  useEffect(() => {
    fetchWarehouses();
    // Bu satır, useEffect için ESLint’in exhaustive-deps uyarısını bilinçli olarak devre dışı bırakır.
    // ESLint exhaustive-deps =  useEffect içinde kullanılan tüm bağımlılıkların dependency array’de olmasını zorunlu kılan ESLint uyarısı.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedQueryKey]);

  //filtre uygulama
  const applySearch = () => {
    const idTrimmed = draftId.trim();
    const nameTrimmed = draftName.trim();

    setAppliedId(idTrimmed ? Number(idTrimmed) : undefined);
    setAppliedName(nameTrimmed ? nameTrimmed : undefined);
    setPageNo(1);
  };

  // filtre temizleme
  const clearSearch = () => {
    setDraftId("");
    setDraftName("");
    setAppliedId(undefined);
    setAppliedName(undefined);
    setPageNo(1);
  };

  // depo sil
  const handleDelete = async (w: Warehouse) => {
    if (!confirm(warehouseTexts.deleteConfirm)) return;

    try {
      await deleteWH(w.warehouseID);
      fetchWarehouses();
    } catch (e) {
      alert(e instanceof Error ? e.message : warehouseTexts.deleteError);
    }
  };

  // ekle düzenle kaydt
  const handleSave = async () => {
    const cityIdTrimmed = form.warehouseCityID.trim();
    if (!cityIdTrimmed) {
      alert(warehouseTexts.validation.cityRequired);
      return;
    }

    const payload = {
      warehouseName: form.warehouseName.trim() || undefined,
      warehouseCityID: Number(cityIdTrimmed),
      warehouseAddress: form.warehouseAddress.trim() || undefined,
    };

    try {
      if (modalMode === "add") {
        await addWH(payload);
        alert(warehouseTexts.messages.addSuccess);
      } else {
        if (!activeWarehouse) return;
        await editWH(activeWarehouse.warehouseID, payload);
        alert(warehouseTexts.messages.editSuccess);
      }

      setShowModal(false);
      setActiveWarehouse(null);
      resetForm();
      fetchWarehouses();
    } catch (e) {
      alert(e instanceof Error ? e.message : warehouseTexts.errors.generic);
    }
  };

  // pagination kontrolü
  const canPrev = pageNo > 1 && !loading;
  const canNext = pageNo < totalPages && !loading;

  return (
    <>
      <Navbar {...navbarTexts} />

      <main className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {warehouseTexts.title}
            </h1>

            <button
              onClick={openAdd}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              {warehouseTexts.actions.addButton}
            </button>
          </div>

          {/* filtre */}
          <div className="flex flex-col md:flex-row gap-3 md:items-end mb-6">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {warehouseTexts.filters.id}
              </label>
              <input
                value={draftId}
                onChange={(e) => setDraftId(e.target.value)}
                placeholder={warehouseTexts.filters.id}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div className="flex-[2]">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {warehouseTexts.filters.name}
              </label>
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder={warehouseTexts.filters.name}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={applySearch}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black transition"
              >
                {warehouseTexts.filters.search}
              </button>
              <button
                onClick={clearSearch}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition"
              >
                {warehouseTexts.filters.clear}
              </button>
            </div>
          </div>

          {/* hata mesajı */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 font-medium">
              {error}
            </div>
          )}

          {/* liste */}             
          {loading ? (
            <p className="text-gray-700 font-medium">
              {warehouseTexts.loading}
              {warehouseTexts.ellipsis}
            </p>
          ) : warehouses.length === 0 ? (
            <p className="text-gray-600 font-medium">{warehouseTexts.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-900">
                  <tr>
                    <th className="p-3 text-left font-semibold">
                      {warehouseTexts.table.id}
                    </th>
                    <th className="p-3 text-left font-semibold">
                      {warehouseTexts.table.name}
                    </th>
                    <th className="p-3 text-left font-semibold">
                      {warehouseTexts.table.address}
                    </th>
                    <th className="p-3 text-left font-semibold">
                      {warehouseTexts.table.city}
                    </th>
                    <th className="p-3 text-left font-semibold">
                      {warehouseTexts.table.country}
                    </th>
                    <th className="p-3 text-left font-semibold">
                      {warehouseTexts.table.action}
                    </th>
                  </tr>
                </thead>

                <tbody className="text-gray-800">
                  {warehouses.map((w) => (
                    <tr
                      key={w.warehouseID}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium">{w.warehouseID}</td>
                      <td className="p-3">
                        {w.warehouseName ?? warehouseTexts.misc.emptyValue}
                      </td>
                      <td className="p-3">
                        {w.warehouseAddress ?? warehouseTexts.misc.emptyValue}
                      </td>
                      <td className="p-3">
                        {w.cityName ?? warehouseTexts.misc.emptyValue}
                      </td>
                      <td className="p-3">
                        {w.countryName ?? warehouseTexts.misc.emptyValue}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEdit(w)}
                            className="text-blue-700 font-semibold hover:text-blue-900 hover:underline"
                          >
                            {warehouseTexts.actions.edit}
                          </button>
                          <button
                            onClick={() => handleDelete(w)}
                            className="text-red-700 font-semibold hover:text-red-900 hover:underline"
                          >
                            {warehouseTexts.actions.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* pagination */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-700 font-medium">
              {warehouseTexts.pagination.page} {pageNo} {warehouseTexts.pagination.of}{" "}
              {totalPages} {warehouseTexts.pagination.separator}{" "}
              {warehouseTexts.pagination.total}: {total}
            </div>

            <div className="flex gap-2">
              <button
                disabled={!canPrev}
                onClick={() => setPageNo((p) => Math.max(1, p - 1))}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  canPrev
                    ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {warehouseTexts.pagination.prev}
              </button>
              <button
                disabled={!canNext}
                onClick={() => setPageNo((p) => Math.min(totalPages, p + 1))}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  canNext
                    ? "bg-gray-900 text-white hover:bg-black"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {warehouseTexts.pagination.next}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-300 my-8">
            <h2 className="text-xl font-extrabold mb-5 text-gray-900">
              {modalMode === "add"
                ? warehouseTexts.modal.addTitle
                : warehouseTexts.modal.editTitle}
            </h2>

            <div className="space-y-4">
              <input
                placeholder={warehouseTexts.modal.name}
                value={form.warehouseName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, warehouseName: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />

              <div>
                <input
                  type="number"
                  placeholder={warehouseTexts.modal.cityID}
                  value={form.warehouseCityID}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, warehouseCityID: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
                {modalMode === "edit" && (
                  <p className="text-xs text-gray-500 mt-1">
                    {warehouseTexts.modal.cityIdHelp}
                  </p>
                )}
              </div>

              <input
                placeholder={warehouseTexts.modal.address}
                value={form.warehouseAddress}
                onChange={(e) =>
                  setForm((f) => ({ ...f, warehouseAddress: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setActiveWarehouse(null);
                  resetForm();
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition"
              >
                {warehouseTexts.modal.cancel}
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition shadow-md"
              >
                {warehouseTexts.modal.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

