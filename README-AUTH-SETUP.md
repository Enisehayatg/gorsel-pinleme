# Görsel Pinleme - Authentication Setup

Bu döküman, Görsel Pinleme uygulamasının kimlik doğrulama (authentication) sisteminin kurulumu için adımları içerir.

## Veritabanı Kurulumu

1. MySQL sunucunuza erişin ve `database_setup.sql` dosyasını çalıştırın. Bu, gerekli tabloları oluşturacaktır:
   - `users`: Kullanıcı bilgilerini saklar
   - `pins`: Kullanıcıların oluşturduğu pin'leri saklar
   - `saved_pins`: Kullanıcıların kaydettiği pin'leri takip eder
   - `comments`: Pin'lere yapılan yorumları saklar

2. SQL dosyasını çalıştırmanın yolları:
   - phpMyAdmin üzerinden: SQL sekmesine gidip dosya içeriğini yapıştırın
   - MySQL komut satırı üzerinden: `mysql -u username -p < database_setup.sql`

## PHP Dosyalarını Kurma

1. PHP dosyalarını (`login.php`, `register.php`, `db_connect.php`) web sunucunuzun kök dizinine veya uygun bir alt klasöre yerleştirin.

2. `db_connect.php` dosyasını düzenleyerek veritabanı bağlantı bilgilerinizi güncelleyin:
   ```php
   $servername = "localhost"; // Veritabanı sunucunuzun adresi
   $username = "root";        // Veritabanı kullanıcı adınız
   $password = "";            // Veritabanı şifreniz
   $dbname = "gorsel_pinleme"; // Veritabanı adınız
   ```

## API Endpoint URL'lerini Güncelleme

1. React Native uygulamasında, `/src/constants/api/index.ts` dosyasında BASE_URL'yi güncelleyin:

```typescript
export const API = {
  BASE_URL: "http://sizin-sunucu-adresiniz/gorsel_pinleme_api", // Örn: https://example.com/api
  
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/register.php",
      LOGIN: "/login.php",
    },
  },
};
```

## Güvenlik Notları

1. Gerçek bir ürün ortamında, daha güçlü bir token yönetimi (JWT gibi) kullanılması önerilir.
2. HTTPS kullanarak API iletişimini şifrelemek önemlidir.
3. Daha kapsamlı hata yönetimi ve güvenlik önlemleri eklenmelidir.

## Test Etme

1. Bir hesap oluşturmak için uygulama üzerinden kayıt formunu doldurun.
2. Veritabanı ve sunucu loglarını kontrol ederek işlemin başarılı olduğunu doğrulayın.
3. Oluşturulan hesap bilgileriyle giriş yapmayı deneyin.

## Sorun Giderme

- Bağlantı hatası alıyorsanız, API URL'sinin doğru olduğunu ve sunucunun çalıştığını kontrol edin.
- Veritabanı hatası alıyorsanız, kullanıcı izinlerini ve veritabanı yapısını kontrol edin.
- CORS hataları için, sunucu tarafında CORS başlıklarının doğru ayarlandığından emin olun. 