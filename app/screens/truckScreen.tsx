import React, { useEffect, useState } from "react";
import { Navbar } from "~/components/navbar";
import { navbarTexts } from "~/props/navbarProps";
import { truckTexts, type Truck, type TruckInfo } from "~/props/truckProps";
import {
  getTrucks,
  listTruckInfo,
  addTruck,
  addTruckInfo,
  editTruckInfo,
  deleteTruckInfo,
  deleteTruck,
} from "~/node_api/trucks";

type ModalMode = "addTruck" | "addTruckInfo" | "editTruckInfo";

export function TruckScreen() {
  // stateler
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [truckInfos, setTruckInfos] = useState<TruckInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal ve form
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("addTruck");
  const [activeTruckInfo, setActiveTruckInfo] = useState<TruckInfo | null>(null);
  const [form, setForm] = useState({
    truckBrand: "",
    truckModel: "",
    truckID: "",
    plate: "",
  });

  // formu resetle
  const resetForm = () => {
    setForm({
      truckBrand: "",
      truckModel: "",
      truckID: "",
      plate: "",
    });
  };

  // yeni tır ekleme modalı aç
  const openAddTruck = () => {
    setModalMode("addTruck");
    setActiveTruckInfo(null);
    resetForm();
    setShowModal(true);
  };

  // yeni tır bilgisi ekleme modalı aç
  const openAddTruckInfo = () => {
    setModalMode("addTruckInfo");
    setActiveTruckInfo(null);
    resetForm();
    // Tırlar yüklenmemişse yükle
    if (trucks.length === 0) {
      fetchTrucks();
    }
    setShowModal(true);
  };

  // tır bilgisi düzenleme modalı aç
  const openEditTruckInfo = (ti: TruckInfo) => {
    setModalMode("editTruckInfo");
    setActiveTruckInfo(ti);
    setForm({
      truckBrand: "",
      truckModel: "",
      truckID: ti.truckID ? ti.truckID.toString() : "",
      plate: ti.plate ?? "",
    });
    // Tırlar yüklenmemişse yükle
    if (trucks.length === 0) {
      fetchTrucks();
    }
    setShowModal(true);
  };

  // tır listesini çek
  const fetchTrucks = async () => {
    try {
      const data = await getTrucks();
      setTrucks(Array.isArray(data) ? data : []);
    } catch (e) {
      setTrucks([]);
    }
  };

  // tır bilgilerini çek
  const fetchTruckInfos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listTruckInfo();
      setTruckInfos(Array.isArray(data) ? data : []);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : truckTexts.errors.fetch;

      // backende tır yok durumu
      if (message === truckTexts.backend.emptyListMessage) {
        setTruckInfos([]);
        setError(null);
      } else {
        setError(message || truckTexts.errors.generic);
        setTruckInfos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // sayfa açıldığında verileri çek
  useEffect(() => {
    fetchTrucks();
    fetchTruckInfos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tır bilgisi sil
  const handleDeleteTruckInfo = async (ti: TruckInfo) => {
    if (!ti.truckInfoID) return;
    if (!confirm(truckTexts.deleteConfirm)) return;

    try {
      await deleteTruckInfo(ti.truckInfoID);
      fetchTruckInfos();
    } catch (e) {
      alert(e instanceof Error ? e.message : truckTexts.deleteError);
    }
  };

  // tır sil
  const handleDeleteTruck = async (truckID: number) => {
    if (!confirm(truckTexts.deleteConfirm)) return;

    try {
      await deleteTruck(truckID);
      fetchTrucks();
      fetchTruckInfos();
    } catch (e) {
      alert(e instanceof Error ? e.message : truckTexts.deleteError);
    }
  };

  // ekle düzenle kaydet
  const handleSave = async () => {
    try {
      if (modalMode === "addTruck") {
        const brandTrimmed = form.truckBrand.trim();
        const modelTrimmed = form.truckModel.trim();

        if (!brandTrimmed) {
          alert(truckTexts.validation.brandRequired);
          return;
        }
        if (!modelTrimmed) {
          alert(truckTexts.validation.modelRequired);
          return;
        }

        await addTruck({
          truckBrand: brandTrimmed,
          truckModel: modelTrimmed,
        });
        alert(truckTexts.messages.addTruckSuccess);
        fetchTrucks();
      } else if (modalMode === "addTruckInfo") {
        const truckIDTrimmed = form.truckID.trim();
        const plateTrimmed = form.plate.trim();

        if (!truckIDTrimmed) {
          alert(truckTexts.validation.truckIDRequired);
          return;
        }
        if (!plateTrimmed) {
          alert(truckTexts.validation.plateRequired);
          return;
        }

        await addTruckInfo({
          truckID: Number(truckIDTrimmed),
          plate: plateTrimmed,
        });
        alert(truckTexts.messages.addTruckInfoSuccess);
        fetchTruckInfos();
      } else if (modalMode === "editTruckInfo") {
        if (!activeTruckInfo || !activeTruckInfo.truckInfoID) return;

        const plateTrimmed = form.plate.trim();
        if (!plateTrimmed) {
          alert(truckTexts.validation.plateRequired);
          return;
        }

        const payload: {
          truckID?: number;
          plate?: string;
        } = {
          plate: plateTrimmed,
        };

        const truckIDTrimmed = form.truckID.trim();
        if (truckIDTrimmed) {
          payload.truckID = Number(truckIDTrimmed);
        }

        await editTruckInfo(activeTruckInfo.truckInfoID, payload);
        alert(truckTexts.messages.editTruckInfoSuccess);
        fetchTruckInfos();
      }

      setShowModal(false);
      setActiveTruckInfo(null);
      resetForm();
    } catch (e) {
      alert(e instanceof Error ? e.message : truckTexts.errors.generic);
    }
  };

  return (
    <>
      <Navbar {...navbarTexts} />

      <main className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {truckTexts.title}
            </h1>

            <div className="flex gap-2">
              <button
                onClick={openAddTruck}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                {truckTexts.actions.addTruckButton}
              </button>
              <button
                onClick={openAddTruckInfo}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                {truckTexts.actions.addTruckInfoButton}
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
              {truckTexts.loading}
              {truckTexts.ellipsis}
            </p>
          ) : truckInfos.length === 0 ? (
            <p className="text-gray-600 font-medium">{truckTexts.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-900">
                  <tr>
                    <th className="p-3 text-left font-semibold">
                      {truckTexts.table.plate}
                    </th>
                    <th className="p-3 text-left font-semibold">
                      {truckTexts.table.brand}
                    </th>
                    <th className="p-3 text-left font-semibold">
                      {truckTexts.table.model}
                    </th>
                    <th className="p-3 text-left font-semibold">
                      {truckTexts.table.action}
                    </th>
                  </tr>
                </thead>

                <tbody className="text-gray-800">
                  {truckInfos.map((ti) => (
                    <tr
                      key={ti.truckInfoID ?? ti.truckID}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{ti.plate ?? truckTexts.misc.emptyValue}</td>
                      <td className="p-3">
                        {ti.truckBrand ?? truckTexts.misc.emptyValue}
                      </td>
                      <td className="p-3">
                        {ti.truckModel ?? truckTexts.misc.emptyValue}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditTruckInfo(ti)}
                            className="text-blue-700 font-semibold hover:text-blue-900 hover:underline"
                          >
                            {truckTexts.actions.edit}
                          </button>
                          <button
                            onClick={() => handleDeleteTruckInfo(ti)}
                            className="text-red-700 font-semibold hover:text-red-900 hover:underline"
                          >
                            {truckTexts.actions.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setActiveTruckInfo(null);
              resetForm();
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-300 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-extrabold mb-5 text-gray-900">
              {modalMode === "addTruck"
                ? truckTexts.modal.addTruckTitle
                : modalMode === "addTruckInfo"
                ? truckTexts.modal.addTruckInfoTitle
                : truckTexts.modal.editTruckInfoTitle}
            </h2>

            <div className="space-y-4">
              {(modalMode === "addTruck" || modalMode === "addTruckInfo") && (
                <>
                  {modalMode === "addTruck" && (
                    <>
                      <input
                        placeholder={truckTexts.modal.truckBrand}
                        value={form.truckBrand}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, truckBrand: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                      <input
                        placeholder={truckTexts.modal.truckModel}
                        value={form.truckModel}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, truckModel: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </>
                  )}

                  {modalMode === "addTruckInfo" && (
                    <>
                      <select
                        value={form.truckID}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, truckID: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      >
                        <option value="">Tır Seçiniz</option>
                        {trucks.map((truck) => (
                          <option key={truck.truckID} value={truck.truckID}>
                            ID: {truck.truckID} - {truck.truckBrand} {truck.truckModel}
                          </option>
                        ))}
                      </select>
                      <input
                        placeholder={truckTexts.modal.plate}
                        value={form.plate}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, plate: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </>
                  )}
                </>
              )}

              {modalMode === "editTruckInfo" && (
                <>
                  <select
                    value={form.truckID}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, truckID: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="">Tır Seçiniz</option>
                    {trucks.map((truck) => (
                      <option key={truck.truckID} value={truck.truckID}>
                        ID: {truck.truckID} - {truck.truckBrand} {truck.truckModel}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder={truckTexts.modal.plate}
                    value={form.plate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, plate: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setActiveTruckInfo(null);
                  resetForm();
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition"
              >
                {truckTexts.modal.cancel}
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-blue-700 text-white font-bold hover:bg-blue-800 transition shadow-md"
              >
                {truckTexts.modal.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
