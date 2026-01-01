// Get User 
export interface User {
  userID: number;
  username: string;
  email?: string;
  tel?: string;
  address?: string;
  job?: string;
  cityID?: number;
  warehouseID?: number;
}


// Add User 
export interface AddUserPayload {
  username: string;
  password: string;
  permission: number;
  email?: string;
  tel?: string;
  cityID?: number;
  address?: string;
  job?: string;
  warehouseID?: number;
}


// textler
export const userManagementTexts = {
  title: "Kullanıcı Yönetimi",

  loading: "Yükleniyor...",
  empty: "Sistemde kullanıcı bulunamadı",

  table: {
    id: "ID",
    username: "Kullanıcı Adı",
    email: "Email",
    action: "İşlem",
  },

  addUser: {
    title: "Kullanıcı Ekle",
    username: "Kullanıcı Adı",
    password: "Şifre",
    passwordHint: "8-64 karakter, en az 1 rakam ve 1 özel karakter içermelidir.",
    email: "Email",
    tel: "Telefon",
    cityID: "Şehir ID",
    address: "Adres",
    job: "Meslek",
    warehouseID: "Depo ID",
    permission: "Yetki",
    cancel: "İptal",
    save: "Kaydet",
    requiredFields: "Tüm alanlar zorunludur.",
    usernameTooLong: "Kullanıcı adı 50 karakterden büyük olamaz.",
    passwordInvalid: "Şifre 8-64 karakter olmalı, en az 1 rakam ve 1 özel karakter içermelidir.",
    error: "Kullanıcı eklenirken bir hata oluştu.",

    usernamePlaceholder: "kullanıcı",
    passwordPlaceholder: "••••••••",
    emailPlaceholder: "email@example.com",
    telPlaceholder: "05...",
    jobPlaceholder: "Müdür",

    userID: "Kullanıcı ID",
    city: "Şehir",
    warehouse: "Depo",
  },
  
  viewUser: {
    title: "Kullanıcı Detayları",
    close: "Kapat",
  },

  permissions: {
    admin: "Admin",
    user: "Kullanıcı",
  },

  delete: "Sil",
  deleteConfirm: "Bu kullanıcı silinsin mi?",
  deleteError: "Kullanıcı silinirken bir hata oluştu.",
  requiredError: "Zorunlu alanlar boş olamaz",
};
