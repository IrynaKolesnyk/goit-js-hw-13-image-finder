import './sass/main.scss';

const debounce = require('lodash.debounce');
import { error, alert } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import * as basicLightbox from 'basiclightbox'
import "basiclightbox/dist/basicLightbox.min.css"

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
refs.galleryContainer.addEventListener('click', onClickBigImg);



function onInputSearchPhoto(event) {
    const inputValue = event.target.value;


    cleareGallaryContainer();
    newsApiServises.query = inputValue;

    if (newsApiServises.query === '') {
        refs.loadMoreBtn.classList.add('is-hidden');
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

    // скролить до кнопки refs.loadMoreBtn
    // refs.loadMoreBtn.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'end',
    // });

    // следить за концом window
    // window.scrollTo({
    //     top: document.documentElement.scrollHeight,
    //     behavior: 'smooth',
    // });

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

function onClickBigImg(event) {
    if (event.target.tagName !== 'IMG') return false;

    const imgSrc = event.target.getAttribute('big-src');

    const instance = basicLightbox
        .create(`<img src="${imgSrc}" width="800" height="600">`)

    instance.show()

    window.addEventListener('click', onClickWindowLightboxClose)
};

function onClickWindowLightboxClose(event) {
    if (event.code === 'Escape') {
        instance.close(() => console.log('лайтбокс больше не отображается'));
    }
};