 import './sass/main.scss';                                                // Подключаем стили
 import throttle from 'lodash.throttle';                                   // Подключаем компоненты библиотек и привязываем к контексту
 import { Notify } from 'notiflix/build/notiflix-notify-aio';               // Подключаем компоненты библиотек и привязываем к контексту 
 import SimpleLightbox from 'simplelightbox';                               // Подключаем компоненты библиотек и привязываем к контексту
 import 'simplelightbox/dist/simple-lightbox.min.css';
 import  photoCardsTpl from './templates/photo-cards.hbs';                  // Подключаем шаблоны
 import imageApiService from './js/searchQueryApi.js';                     // Подключаем компоненты библиотек и привязываем к контексту

const refs = { 
    searchForm: document.querySelector('#search-form'),                    // Получаем элементы страницы
    imgGallery: document.querySelector('#gallery'),                         
    loadMoreBtn: document.querySelector('#load-more'),
};
    
 const searchImageService = new imageApiService ();                         // Создаем экземпляр класса для получения данных от сервера
 const lightbox = new SimpleLightbox('.gallery a'); 

refs.searchForm.addEventListener('submit', onSearch);                      // Привязываем обработчики событий
refs.loadMoreBtn.addEventListener('click', onLoadMore);
window.addEventListener('scroll', throttle(infiniteScroll, 500));
                                                                        // Подключаем компоненты библиотек и привязываем к контексту

async function onSearch(event) {                                            // Асинхронная функция поиска изображений
    event.preventDefault();                                                // Отменяем действие по умолчанию
                                           
    clearGallery();                                                         // Очищаем галерею
    const inputValue = event.currentTarget.elements.query.value;            // Получаем значение поля поиска
    if (inputValue === '') {
         return;
     }           
    searchImageService.query = inputValue;                                  // Присваиваем значение полю поиска значение поля поиска
    searchImageService.resetPage();                                        // Сбрасываем номер страницы
    try{
    await searchImageService.fetchImages()                                  // Получаем данные от сервера
        .then(appendImageGalleryMarkup); 
    scrollToTop();                                                              // Прокручиваем страницу в начало
    onSearchHits();
    lightbox.refresh();                                                         // Проверяем наличие данных на сервере
    if (searchImageService.totalHits !== 0) {                               // Если данных на сервере нет, то выводим сообщение
        Notify.success(`Hooray! We found ${searchImageService.totalHits} images.`);   // Выводим сообщение
    }
    } catch (error) {
       console.log(error);
    }
}

async function onLoadMore() {
    searchImageService.incrementPage();                                             // Асинхронная функция подгрузки изображений
    await searchImageService.fetchImages()                                   // Получаем данные от сервера
        .then(appendImageGalleryMarkup);                                     // Добавляем данные в галерею
    onSearchHits();                                                           // Проверяем наличие данных на сервере
    lightbox.refresh();                                                      // Обновляем окно изображения
    if (searchImageService.totalHits <= searchImageService.getFetchElNum()) {       // Если данных на сервере нет, то выводим сообщение
        Notify.info(`We're sorry, but you've reached the end of search results.`);   // Выводим сообщение   
        refs.loadMoreBtn.classList.add('is-hidden');                                // Скрываем кнопку подгрузки
        return;                           
    }
}   

function appendImageGalleryMarkup(hits) {                                      // Функция добавления данных в галерею
       const markup = photoCardsTpl(hits);                                      // Получаем разметку для добавления в галерею
       refs.imgGallery.insertAdjacentHTML('beforeend', markup);                 // Добавляем данные в галерею
       refs.loadMoreBtn.classList.remove('is-hidden');                          // Показываем кнопку подгрузки
    }
 
function clearGallery() {                                                       // Функция очистки галереи
        refs.imgGallery.innerHTML = '';
    }

function onSearchHits() {                                                      // Функция проверки наличия данных на сервере
        if (searchImageService.totalHits === 0) {                              // Если данных на сервере нет, то выводим сообщение
            Notify.failure("Sorry, there are no images matching your search query. Please try again..");      // Выводим сообщение
            refs.loadMoreBtn.classList.add('is-hidden');                              // Скрываем кнопку подгрузки                          
        }
    }

function infiniteScroll() {                                                     // Функция бесконечной прокрутки 
    const documentRect = document
    .documentElement.getBoundingClientRect();                                     // Получаем координаты окна браузера
    if (documentRect.bottom < document
        .documentElement.clientHeight + 1400) {                                 // Если координаты окна браузера меньше высоты окна браузера + высота окна браузера, то вызываем функцию подгрузки
        onLoadMore();                                                            // Вызываем функцию подгрузки
    }
}

function scrollToTop() {                                                         // Функция прокрутки в начало страницы
  const { top: cardTop } = refs.imgGallery.getBoundingClientRect();             // Получаем координаты галереи
  window.scrollBy({                                                              // Прокручиваем окно браузера
    top: cardTop - 100,                                                          // Координаты галереи - высота окна браузера
    behavior: 'smooth',                                                          // Скроллим браузер с задержкой
  });
}