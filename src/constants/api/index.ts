export const API = {
  // Seçtiğiniz URL'yi aktif hale getirin
  BASE_URL: "http://localhost/gorsel_pinleme_api", // Lokal test için
  //BASE_URL: "http://10.0.2.2/gorsel_pinleme_api", // Android Emulator için
  //BASE_URL: "http://192.168.X.X/gorsel_pinleme_api", // Fiziksel cihaz için (IP adresinizi yazın)

  ENDPOINTS: {
    AUTH: {
      REGISTER: "/register.php",
      LOGIN: "/login.php",
    },
    USER: {
      UPDATE_PROFILE: "/update_profile.php",
    },
  },
};
