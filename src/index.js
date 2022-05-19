 import './sass/main.scss';
 import throttle from 'lodash.throttle';
 import { Notify } from 'notiflix/build/notiflix-notify-aio';
 import SimpleLightbox from 'simplelightbox';
 import 'simplelightbox/dist/simple-lightbox.min.css';
 import  photoCardsTpl from './templates/photo-cards.hbs';
 import imageApiService from './js/searchQueryApi.js';


const lightbox = new SimpleLightbox('.gallery a');  
const refs = {
    searchForm: document.querySelector('#search-form'),
    imgGallery: document.querySelector('#gallery'),
    loadMoreBtn: document.querySelector('#load-more'),
};
const searchImageService = new imageApiService ();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
    event.preventDefault();
    clearGallery();
    lightbox.refresh();
    const inputValue = event.currentTarget.elements.query.value;
    searchImageService.query = inputValue;
    await searchImageService.fetchImages()
        .then(appendImageGalleryMarkup);
    onSearchHits();
    refs.loadMoreBtn.classList.remove('is-hidden');
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
            return;
        }
          
    }
