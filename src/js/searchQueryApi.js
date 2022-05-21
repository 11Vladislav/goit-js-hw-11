import axios from 'axios';                                       // Подключаем библиотеку для запросов "axios"
export default class imageApiService {                           // Эспортируем класс для доступа из других файлов
    constructor() {                                              // Конструктор класса
        this.searchQuery = '';                                   // Поисковый запрос
        this.page = 1;                                           // Номер страницы
        this.perPage = 40;                                       // Количество элементов на странице
        this.totalHits = 0;
    }
  
    async fetchImages() {
        const KEY_API = '27419021-5af7f5b25b944ef02740df41a';       // Ключ API
        const URL_API = 'https://pixabay.com/api/';                 // Адрес API
        const parametrs = new URLSearchParams({                     // Параметры запроса
            key: KEY_API,                                           // Ключ API
            q: this.query,                                          // Поисковый запрос
            image_type: 'photo',                                    // Тип изображения
            orientation: 'horizontal',                              // Ориентация изображения
            per_page: this.perPage,                                 // Количество элементов на странице
            page: this.page,                                       // Номер страницы
        });
        const url = `${URL_API}?${parametrs}`;                     // Собираем полный адрес запроса
        this.incrementPage();                                      // Увеличиваем номер страницы
        const response = await axios.get(url);                     // Отправляем запрос на сервер
        this.totalHits = response.data.totalHits;
        if (!response.data.hits) {                             // Если нет изображений
            throw new Error('Error');
        }
        return response.data.hits;
    }    

    getFetchElNum() {                                              // Получаем количество элементов на странице
        return this.perPage * (this.page - 1);                     // Вычисляем номер элемента начиная с нуля
    }

    incrementPage() {                                              // Увеличиваем номер страницы
        this.page += 1;
    }

    resetPage() {                                                  // Сбрасываем номер страницы
        this.page = 1;
    }

    get query(){                                                   // Получаем поисковый запрос
        return this.searchQuery;
    }

    set query(newQuery){                                           // Устанавливаем поисковый запрос
        this.searchQuery = newQuery;
        this.resetPage();
    }
 }