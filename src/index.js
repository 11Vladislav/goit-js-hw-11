 import './sass/main.scss';                                                // Подключаем стили
 import throttle from 'lodash.throttle';                                   // Подключаем компоненты библиотек и привязываем к контексту
 import { Notify } from 'notiflix/build/notiflix-notify-aio';               // Подключаем компоненты библиотек и привязываем к контексту 
 import SimpleLightbox from 'simplelightbox';                               // Подключаем компоненты библиотек и привязываем к контексту
 import 'simplelightbox/dist/simple-lightbox.min.css';
 import  photoCardsTpl from './templates/photo-cards.hbs';                  // Подключаем шаблоны
 import imageApiService from './js/searchQueryApi.js';                     // Подключаем компоненты библиотек и привязываем к контексту


const lightbox = new SimpleLightbox('.gallery a');                         // Создаем окно изображения с помощью библиотеки SimpleLightbox
const refs = { 
    searchForm: document.querySelector('#search-form'),                    // Получаем элементы страницы
    imgGallery: document.querySelector('#gallery'),                         
    loadMoreBtn: document.querySelector('#load-more'),
    loadSpinner: document.querySelector('#loading-container'),
};
const searchImageService = new imageApiService ();                         // Создаем экземпляр класса для получения данных от сервера

refs.searchForm.addEventListener('submit', onSearch);                      // Привязываем обработчики событий
refs.loadMoreBtn.addEventListener('click', onLoadMore);
window.addEventListener('scroll', throttle(infiniteScroll, 500));                    

async function onSearch(event) {                                                
    event.preventDefault();
    clearGallery();
    lightbox.refresh();
    const inputValue = event.currentTarget.elements.query.value;
    searchImageService.query = inputValue;
    await searchImageService.fetchImages()
        .then(appendImageGalleryMarkup);
    onSearchHits();
    if (searchImageService.totalHits !== 0) {
        Notify.success(`Hooray! We found ${searchImageService.totalHits} images.`);
    }
}

async function onLoadMore() {
    await searchImageService.fetchImages()
        .then(appendImageGalleryMarkup);
    lightbox.refresh();
    if (searchImageService.totalHits <= searchImageService.getFetchElNum()) {
        Notify.info(`We're sorry, but you've reached the end of search results.`);
        refs.loadMoreBtn.classList.add('is-hidden');
    }
}   

function appendImageGalleryMarkup(hits) {
       const markup = photoCardsTpl(hits);
       refs.imgGallery.insertAdjacentHTML('beforeend', markup);
       refs.loadMoreBtn.classList.remove('is-hidden');
    }

function clearGallery() {
        refs.imgGallery.innerHTML = '';
    }

function onSearchHits() {
         
        if (searchImageService.totalHits === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again..");
            refs.loadMoreBtn.classList.add('is-hidden');
            refs.loadSpinner.classList.add('is-hidden');
        }
         
    }

function infiniteScroll() {
    const documentRect = document.documentElement.getBoundingClientRect();
    if (documentRect.bottom < document.documentElement.clientHeight + 1400) {
    onLoadMore();
  }
}