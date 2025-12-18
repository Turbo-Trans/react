// types

// bir depo nesnesi 
export interface Warehouse {
  warehouseID: number;
  warehouseName: string;
  warehouseAddress?: string;
  cityName?: string;
  countryName?: string;
}

// depo listeleme parametreleri
export interface GetWarehouseParams {
  id?: number;
  name?: string;
  pageNo?: number;
}

// depo listesi api
export interface WarehouseListResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Warehouse[];
}

// yeni depo ekleme
export interface AddWarehousePayload {
  warehouseName?: string;
  warehouseCityID: number;
  warehouseAddress?: string;
}
// yeni depo ekleme response mesajı
export interface AddWarehouseResponse {
  message: string;
  id: number;
}

// depo düzenleme
export interface EditWarehousePayload {
  warehouseName?: string;
  warehouseCityID?: number;
  warehouseAddress?: string;
}

// depo düzenleme response mesajı
export interface EditWarehouseResponse {
  message: string;
}

// depo silme response mesajı
export interface DeleteWarehouseResponse {
  message: string;
}

// textler
export const warehouseTexts = {
  title: "Depo Yönetimi",

  loading: "Depolar yükleniyor",
  ellipsis: "...",
  empty: "Sistemde kayıtlı depo bulunamadı",

  errors: {
    generic: "Bir hata oluştu",
    fetch: "Depolar alınırken bir hata oluştu",
  },

  backend: {
    emptyListMessage: "Hicbir depo kaydi bulunamadi.",
  },

  misc: {
    emptyValue: "-",
  },

  filters: {
    id: "ID",
    name: "Depo Adı",
    search: "Ara",
    clear: "Temizle",
  },

  pagination: {
    prev: "Önceki",
    next: "Sonraki",
    page: "Sayfa",
    of: "/",
    separator: "•",
    total: "Toplam",
  },

  table: {
    id: "ID",
    name: "Depo Adı",
    address: "Adres",
    city: "Şehir",
    country: "Ülke",
    action: "İşlem",
  },

  actions: {
    add: "Depo Ekle",
    addButton: "+ Depo Ekle",
    edit: "Düzenle",
    delete: "Sil",
  },

  deleteConfirm: "Bu depo silinsin mi?",
  deleteError: "Depo silinirken bir hata oluştu",

  modal: {
    addTitle: "Yeni Depo Ekle",
    editTitle: "Depo Bilgilerini Güncelle",

    name: "Depo Adı",
    cityID: "Şehir ID",
    address: "Depo Adresi",
    cityIdHelp: "Güncelleme için Şehir ID alanını giriniz",

    cancel: "İptal",
    save: "Kaydet",
  },

  validation: {
    cityRequired: "Şehir ID girilmesi zorunludur",
  },

  messages: {
    addSuccess: "Depo başarıyla eklendi",
    editSuccess: "Depo bilgileri güncellendi",
  },
};
