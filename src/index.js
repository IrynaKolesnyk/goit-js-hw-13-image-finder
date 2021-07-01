import './sass/main.scss';

const debounce = require('lodash.debounce');
import { error, alert, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '../node_modules/@pnotify/core/dist/BrightTheme.css';
defaultModules.set(PNotifyMobile, {});

import NewsApiServises from './apiService.js';
import photoCardMarcup from './partials/photo-card.hbs';

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
}

const newsApiServises = new NewsApiServises();

refs.searchForm.addEventListener('input', debounce(onInputSearchPhoto, 500));
refs.loadMoreBtn.addEventListener('click', onLoadMore);


function onInputSearchPhoto(event) {
    const inputValue = event.target.value;


    cleareGallaryContainer();
    newsApiServises.query = inputValue;

    if (newsApiServises.query === '') {
        alert({
            text: 'Please, enter the text',
            delay: 1000,
        });
        return;
    };

    newsApiServises.resetPage();
    newsApiServises.fetchPhoto()
        .then(renderPhotoCard)
        .catch(error => console.log(error));
};

function renderPhotoCard(hits) {

    if (hits.length === 0) {
        error({
            text: 'Invalid request',
            delay: 1000,
        });
        return;
    }

    addMarkup(hits);

    const elementScroll = document.querySelectorAll('.gallery_item');
    elementScroll[elementScroll.length - 12].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        alignToTop: true,
    });

};

function cleareGallaryContainer() {
    refs.galleryContainer.innerHTML = '';
}

function addMarkup(element) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', photoCardMarcup(element));
    refs.loadMoreBtn.classList.remove('is-hidden');
};

function onLoadMore(event) {
    newsApiServises.fetchPhoto()
        .then(renderPhotoCard);
};

// basicLightbox 