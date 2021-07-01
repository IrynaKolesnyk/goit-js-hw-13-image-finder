export default class NewsApiServises {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchPhoto() {
        const API_KEY = '22304923-6eee9d90b3f96a111312c1d99';
        const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&lang=en,ru&key=${API_KEY}`;
        return fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.incrementPage();
                return data.hits;
            })
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

};