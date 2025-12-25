export interface Truck {
  truckID: number;
  truckBrand: string;
  truckModel: string;
}

export interface TruckInfo {
  truckInfoID?: number;
  truckID: number;
  plate: string;
  truckBrand?: string;
  truckModel?: string;
}

// textler
export const truckTexts = {
  title: "Tır Yönetimi",

  loading: "Tırlar yükleniyor",
  ellipsis: "...",
  empty: "Sistemde kayıtlı tır bulunamadı",

  errors: {
    generic: "Bir hata oluştu",
    fetch: "Tırlar alınırken bir hata oluştu",
  },

  backend: {
    emptyListMessage: "Hicbir tır kaydi bulunamadi.",
  },

  misc: {
    emptyValue: "-",
  },

  table: {
    id: "ID",
    truckID: "Tır ID",
    plate: "Plaka",
    brand: "Marka",
    model: "Model",
    action: "İşlem",
  },

  actions: {
    addTruck: "Tır Ekle",
    addTruckButton: "+ Tır Ekle",
    addTruckInfo: "Tır Bilgisi Ekle",
    addTruckInfoButton: "+ Tır Bilgisi Ekle",
    edit: "Düzenle",
    delete: "Sil",
  },

  deleteConfirm: "Bu kayıt silinsin mi?",
  deleteError: "Kayıt silinirken bir hata oluştu",

  modal: {
    addTruckTitle: "Yeni Tır Ekle",
    editTruckInfoTitle: "Tır Bilgilerini Güncelle",
    addTruckInfoTitle: "Yeni Tır Bilgisi Ekle",

    truckBrand: "Tır Markası",
    truckModel: "Tır Modeli",
    truckID: "Tır ID",
    plate: "Plaka",

    cancel: "İptal",
    save: "Kaydet",
  },

  validation: {
    brandRequired: "Tır markası girilmesi zorunludur",
    modelRequired: "Tır modeli girilmesi zorunludur",
    truckIDRequired: "Tır ID girilmesi zorunludur",
    plateRequired: "Plaka girilmesi zorunludur",
  },

  messages: {
    addTruckSuccess: "Tır başarıyla eklendi",
    addTruckInfoSuccess: "Tır bilgisi başarıyla eklendi",
    editTruckInfoSuccess: "Tır bilgileri güncellendi",
  },
};

