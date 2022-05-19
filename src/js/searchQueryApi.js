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
        const url = `${URL_API}?${parametrs}`;
        this.incrementPage();
        const response = await axios.get(url);
        this.totalHits = response.data.totalHits;
        return response.data.hits;
     
    }    

    getFetchElNum() {
        return this.perPage * (this.page - 1);
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query(){
        return this.searchQuery;
    }

    set query(newQuery){
        this.searchQuery = newQuery;
        this.resetPage();
    }
 }
