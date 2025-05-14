<?php

namespace Database\Seeders;

use App\Models\Todo;
use App\Models\Category;
use Illuminate\Database\Seeder;

class TodoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Örnek kategoriler oluştur
        $categories = [
            ['name' => 'İş', 'color' => '#FF4444', 'description' => 'İş ile ilgili görevler'],
            ['name' => 'Kişisel', 'color' => '#33B679', 'description' => 'Kişisel görevler'],
            ['name' => 'Alışveriş', 'color' => '#7986CB', 'description' => 'Alışveriş listesi'],
            ['name' => 'Sağlık', 'color' => '#8E24AA', 'description' => 'Sağlık ile ilgili görevler'],
            ['name' => 'Eğitim', 'color' => '#F09300', 'description' => 'Eğitim ile ilgili görevler'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Örnek todo'lar oluştur
        $todos = [
            [
                'title' => 'Haftalık rapor hazırla',
                'description' => 'Pazartesi toplantısı için haftalık raporu hazırla',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(2),
                'categories' => [1] // İş kategorisi
            ],
            [
                'title' => 'Market alışverişi',
                'description' => 'Süt, ekmek, meyve al',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDay(),
                'categories' => [3] // Alışveriş kategorisi
            ],
            [
                'title' => 'Spor salonu',
                'description' => 'Günlük egzersiz rutini',
                'status' => 'in_progress',
                'priority' => 'medium',
                'due_date' => now(),
                'categories' => [2, 4] // Kişisel ve Sağlık kategorileri
            ],
            [
                'title' => 'Laravel eğitimi',
                'description' => 'Laravel dökümantasyonunu oku',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(5),
                'categories' => [5] // Eğitim kategorisi
            ],
            [
                'title' => 'Doktor randevusu',
                'description' => 'Yıllık check-up randevusu',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(7),
                'categories' => [4] // Sağlık kategorisi
            ],
            [
                'title' => 'Proje sunumu hazırla',
                'description' => 'Yeni proje için sunum dosyasını hazırla',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(3),
                'categories' => [1, 5]
            ],
            [
                'title' => 'Kitap okuma',
                'description' => 'Clean Code kitabını bitir',
                'status' => 'in_progress',
                'priority' => 'medium',
                'due_date' => now()->addDays(10),
                'categories' => [2, 5]
            ],
            [
                'title' => 'Ev temizliği',
                'description' => 'Genel ev temizliği yap',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => now()->addDays(1),
                'categories' => [2]
            ],
            [
                'title' => 'Diş randevusu',
                'description' => '6 aylık kontrol',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(14),
                'categories' => [4]
            ],
            [
                'title' => 'React kurs videoları',
                'description' => 'React hooks konusunu bitir',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(4),
                'categories' => [5]
            ],
            [
                'title' => 'Fatura ödemeleri',
                'description' => 'Elektrik, su ve doğalgaz faturalarını öde',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(2),
                'categories' => [2]
            ],
            [
                'title' => 'Müşteri görüşmesi',
                'description' => 'Yeni müşteri ile proje detaylarını konuş',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(1),
                'categories' => [1]
            ],
            [
                'title' => 'Spor malzemeleri al',
                'description' => 'Yeni spor ayakkabısı ve mat al',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => now()->addDays(5),
                'categories' => [3, 4]
            ],
            [
                'title' => 'CV güncelleme',
                'description' => 'CV\'yi yeni projelerle güncelle',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(7),
                'categories' => [1, 2]
            ],
            [
                'title' => 'Yoga dersi',
                'description' => 'Online yoga dersine katıl',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(2),
                'categories' => [2, 4]
            ],
            [
                'title' => 'Kod review',
                'description' => 'Takım arkadaşlarının PR\'larını incele',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDay(),
                'categories' => [1]
            ],
            [
                'title' => 'Haftalık planlama',
                'description' => 'Gelecek hafta için görev planlaması yap',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(2),
                'categories' => [1, 2]
            ],
            [
                'title' => 'Online kurs kaydı',
                'description' => 'AWS sertifikası için kursa kayıt ol',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(3),
                'categories' => [5]
            ],
            [
                'title' => 'Vitamin takviyeleri',
                'description' => 'D vitamini ve multivitamin al',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(2),
                'categories' => [3, 4]
            ],
            [
                'title' => 'Proje dokümantasyonu',
                'description' => 'API dokümantasyonunu güncelle',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(4),
                'categories' => [1, 5]
            ],
            [
                'title' => 'Aile ziyareti',
                'description' => 'Hafta sonu aile ziyareti',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(5),
                'categories' => [2]
            ],
            [
                'title' => 'Kıyafet alışverişi',
                'description' => 'Ofis için yeni kıyafetler al',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => now()->addDays(7),
                'categories' => [3]
            ],
            [
                'title' => 'Blog yazısı',
                'description' => 'Tech blog için yeni yazı hazırla',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(6),
                'categories' => [1, 5]
            ],
            [
                'title' => 'Diyet programı',
                'description' => 'Beslenme uzmanı ile görüşme',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(8),
                'categories' => [4]
            ],
            [
                'title' => 'Proje toplantısı',
                'description' => 'Sprint review toplantısı',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(3),
                'categories' => [1]
            ],
            [
                'title' => 'Ev tadilatı planı',
                'description' => 'Mutfak renovasyonu için plan yap',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => now()->addDays(10),
                'categories' => [2]
            ],
            [
                'title' => 'Network etkinliği',
                'description' => 'Tech meetup\'a katıl',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(7),
                'categories' => [1, 2, 5]
            ],
            [
                'title' => 'Hediye alışverişi',
                'description' => 'Doğum günü hediyeleri al',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(4),
                'categories' => [3]
            ],
            [
                'title' => 'Fitness hedefleri',
                'description' => 'Aylık fitness hedeflerini belirle',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(2),
                'categories' => [2, 4]
            ],
            [
                'title' => 'Mentorluk görüşmesi',
                'description' => 'Junior developer ile haftalık görüşme',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(1),
                'categories' => [1, 5]
            ]
        ];

        foreach ($todos as $todo) {
            $categories = $todo['categories'];
            unset($todo['categories']);
            
            $newTodo = Todo::create($todo);
            $newTodo->categories()->attach($categories);
        }
    }
}
