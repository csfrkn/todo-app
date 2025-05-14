# Todo App

Modern ve kullanıcı dostu bir görev yönetim uygulaması. Laravel backend ve React frontend ile geliştirilmiştir.

## Özellikler

- 🎯 Görev oluşturma, düzenleme ve silme
- 📋 Görevleri listeleme ve takvim görünümü
- 🔍 Gelişmiş arama ve filtreleme
- 🏷️ Kategori yönetimi
- 🌓 Karanlık/Aydınlık tema desteği
- 📱 Responsive tasarım
- ⚡ Performans optimizasyonları

## Teknolojiler

### Backend
- Laravel 10
- MySQL
- PHP 8.1+

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- React Hook Form
- Axios

## Kurulum

### Backend (Laravel)

1. Repoyu klonlayın:
```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

2. Composer bağımlılıklarını yükleyin:
```bash
cd laravel
composer install
```

3. .env dosyasını oluşturun:
```bash
cp .env.example .env
```

4. Uygulama anahtarını oluşturun:
```bash
php artisan key:generate
```

5. Veritabanı ayarlarını yapın:
   - .env dosyasında veritabanı bilgilerini düzenleyin
   - Veritabanını oluşturun
   - Migrasyonları çalıştırın:
```bash
php artisan migrate
```

6. Uygulamayı çalıştırın:
```bash
php artisan serve
```

### Frontend (React)

1. React klasörüne gidin:
```bash
cd react-frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Kullanım

1. Tarayıcınızda `http://localhost:8000` adresine gidin (Laravel development server varsayılan portu)
2. Yeni görev eklemek için "Yeni Görev Ekle" butonuna tıklayın
3. Görevleri filtrelemek için arama kutusunu ve filtreleri kullanın
4. Görevleri düzenlemek veya silmek için ilgili görev kartı üzerindeki butonları kullanın
5. Takvim görünümüne geçmek için sağ üst köşedeki takvim ikonuna tıklayın

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın. 