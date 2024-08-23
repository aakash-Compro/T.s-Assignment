"use strict";
let bookId = document.getElementById('input-search-id');
let genre = document.getElementById('input-search-genre');
let priceMin = document.getElementById('input-search-price-min');
let priceMax = document.getElementById('input-search-price-max');
let author = document.getElementById('input-search-author');
let publicationYear = document.getElementById('input-search-year');
let similarBook = document.querySelector('.similar-books');
let searchBookId = document.getElementById('book-id');
let searchPrice = document.getElementById('book-price');
let searchGenre = document.getElementById('book-genre');
let searchAuthor = document.getElementById('book-author');
let searchPublicationYear = document.getElementById('book-year');
let examinedThumbnail = document.getElementById('book-coverup');
let defaultCoverUp = './asset/empty_book.jpeg';
let api_Url = 'https://assignment-test-data-101.s3.ap-south-1.amazonaws.com/books-v2.json';
let arr_data = [];
let similarbook_data = [];
let currentPage = 1;
let rowsPage = 10;
let upper = true;
let similarTable = document.querySelector('#table-similar-books tbody');
let resultIdContainer = document.getElementById('result-id');
let resultAuthorContainer = document.getElementById('result-author');
let dropDown = document.querySelectorAll('.dropdown-item');
const checkbox = document.getElementById('checkbox');
checkbox.addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
});
bookId.addEventListener('input', function () {
    const query = bookId.value.toLowerCase();
    const results = arr_data.filter((book) => book.bookId.toLowerCase().includes(query));
    displayResults('result-id', results, 'id');
});
author.addEventListener('input', function () {
    const query = author.value.toLowerCase();
    const results = arr_data.filter(book => book.author.toLowerCase().includes(query));
    displayResults('result-author', results, 'author');
});
document.addEventListener('click', function (event) {
    const targetElement = event.target;
    if (!targetElement.closest('.form-cmontrol')) {
        const resultIdElement = document.getElementById('result-id');
        const resultAuthorElement = document.getElementById('result-author');
        if (resultIdElement) {
            resultIdElement.style.display = 'none';
        }
        if (resultAuthorElement) {
            resultAuthorElement.style.display = 'none';
        }
    }
});
author.addEventListener('focus', function () {
    resultIdContainer.style.display = 'none';
});
bookId.addEventListener('focus', function () {
    resultAuthorContainer.style.display = 'none';
});
function displayResults(containerId, results, type) {
    let container = document.getElementById(containerId);
    container.innerHTML = '';
    if (results.length > 0) {
        results.forEach((book) => {
            let resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.textContent = type === 'id' ? book.bookId : book.author;
            resultItem.addEventListener('click', function () {
                const inputElement = document.getElementById(`input-search-${type}`);
                if (inputElement) {
                    inputElement.value = resultItem.textContent;
                }
                container.style.display = 'none';
            });
            container.appendChild(resultItem);
        });
        container.style.display = 'block';
    }
    else {
        container.style.display = 'none';
    }
}
function sortingdata(categorytype, tabletype) {
    if (tabletype === 'similardatatable') {
        if (categorytype === 'price') {
            if (upper) {
                similarbook_data.sort((a, b) => a.price - b.price);
            }
            else {
                similarbook_data.sort((a, b) => b.price - a.price);
            }
        }
        else if (categorytype === 'year') {
            if (upper) {
                similarbook_data.sort((a, b) => a.publicationYear - b.publicationYear);
            }
            else {
                similarbook_data.sort((a, b) => b.publicationYear - a.publicationYear);
            }
        }
        upper = !upper;
        similarTable.innerHTML = '';
        similarbook_data.slice(0, 10).forEach((book) => {
            let coverbookImage;
            if (book.coverImage) {
                coverbookImage = book.coverImage;
            }
            else {
                coverbookImage = defaultCoverUp;
            }
            const rowEntry = document.createElement('tr');
            let imgtd = document.createElement('td');
            let img = document.createElement('img');
            img.src = coverbookImage;
            img.alt = book.bookName;
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.objectFit = 'contain';
            imgtd.appendChild(img);
            rowEntry.appendChild(imgtd);
            let genretd = document.createElement('td');
            genretd.innerHTML = book.genre;
            rowEntry.appendChild(genretd);
            let pricetd = document.createElement('td');
            pricetd.innerHTML = `$ ${book.price}`;
            rowEntry.appendChild(pricetd);
            let authorTd = document.createElement('td');
            authorTd.innerHTML = book.author;
            rowEntry.appendChild(authorTd);
            let publicyearTd = document.createElement('td');
            publicyearTd.innerHTML = book.publicationYear.toString();
            rowEntry.appendChild(publicyearTd);
            let bookNameTd = document.createElement('td');
            bookNameTd.innerHTML = book.bookName;
            rowEntry.appendChild(bookNameTd);
            similarTable.appendChild(rowEntry);
        });
    }
    else if (tabletype === 'alldatatable') {
        if (categorytype === 'price') {
            if (upper) {
                arr_data.sort((a, b) => a.price - b.price);
            }
            else {
                arr_data.sort((a, b) => b.price - a.price);
            }
        }
        else if (categorytype === 'year') {
            if (upper) {
                arr_data.sort((a, b) => a.publicationYear - b.publicationYear);
            }
            else {
                arr_data.sort((a, b) => b.publicationYear - a.publicationYear);
            }
        }
        upper = !upper;
        allbooks();
    }
}
function lazyLoadImages() {
    let lazyImages = document.querySelectorAll('img.lazy-img');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    let img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.8
        });
        lazyImages.forEach(img => observer.observe(img));
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('btn-search');
    const inputFields = document.querySelectorAll('input[type="text"]');
    inputFields.forEach(input => {
        input.addEventListener('input', checkInputs);
    });
    function checkInputs() {
        let isAnyInputFilled = false;
        for (const input of inputFields) {
            if (input.value.trim() !== '') {
                isAnyInputFilled = true;
                break;
            }
        }
        searchButton.disabled = !isAnyInputFilled;
        if (searchButton.disabled) {
            searchButton.classList.add('btn-disabled');
        }
        else {
            searchButton.classList.remove('btn-disabled');
        }
    }
    checkInputs();
});
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    loader.classList.add("loader-hidden");
    loader.addEventListener("transitionend", () => {
        document.body.removeChild(loader);
    });
});
function similarBooksDetails(similardata) {
    let similargenerebooks = arr_data.filter((ele) => ele.bookId !== (similardata === null || similardata === void 0 ? void 0 : similardata.bookId) &&
        ele.genre.toLowerCase() === (similardata === null || similardata === void 0 ? void 0 : similardata.genre.toLowerCase()));
    let similarPricedBooks = arr_data.filter((book) => book.bookId !== (similardata === null || similardata === void 0 ? void 0 : similardata.bookId) &&
        book.price >= (similardata === null || similardata === void 0 ? void 0 : similardata.price) * 0.9 &&
        book.price <= (similardata === null || similardata === void 0 ? void 0 : similardata.price) * 1.1);
    let duplicateIds = new Set(similargenerebooks
        .filter((book) => similarPricedBooks.some((b) => (b === null || b === void 0 ? void 0 : b.bookId) === book.bookId))
        .map((book) => book.bookId));
    let combinedArray = [
        ...similargenerebooks.filter((book) => !duplicateIds.has(book.bookId)),
        ...similarPricedBooks.filter((book) => !duplicateIds.has(book.bookId)),
    ];
    similarbook_data = [...combinedArray];
    similarTable.innerHTML = '';
    combinedArray.slice(0, 10).forEach((book) => {
        let coverbookImage;
        if (book.coverImage) {
            coverbookImage = book.coverImage;
        }
        else {
            coverbookImage = defaultCoverUp;
        }
        const rowEntry = document.createElement('tr');
        let imgtd = document.createElement('td');
        let img = document.createElement('img');
        img.alt = book.bookName;
        img.setAttribute('data-src', coverbookImage);
        img.classList.add('lazy-img');
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.objectFit = 'contain';
        imgtd.appendChild(img);
        rowEntry.appendChild(imgtd);
        let genretd = document.createElement('td');
        genretd.innerHTML = book.genre;
        rowEntry.appendChild(genretd);
        let pricetd = document.createElement('td');
        pricetd.innerHTML = `$ ${book.price}`;
        rowEntry.appendChild(pricetd);
        let authorTd = document.createElement('td');
        authorTd.innerHTML = book.author;
        rowEntry.appendChild(authorTd);
        let publicyearTd = document.createElement('td');
        publicyearTd.innerHTML = book.publicationYear;
        rowEntry.appendChild(publicyearTd);
        let bookNameTd = document.createElement('td');
        bookNameTd.innerHTML = book.bookName;
        rowEntry.appendChild(bookNameTd);
        similarTable.appendChild(rowEntry);
    });
    lazyLoadImages();
}
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
});
function examinedBookDeatils(filterDatarr) {
    if (filterDatarr.length === 0) {
        examinedThumbnail.src = defaultCoverUp;
        searchBookId.innerHTML = '<b>No Data found!!!!</b>';
        searchPrice.innerHTML = '<b>No Data Found!!!!</b>';
        searchGenre.innerHTML = '<b>No Data Found!!!!</b>';
        searchAuthor.innerHTML = '<b>No Data Found!!!!</b>';
        searchPublicationYear.innerHTML = '<b>No Data Found!!!!</b>';
        examinedThumbnail.src = defaultCoverUp;
        similarBook.style.display = 'none';
    }
    else {
        let ExamineBookData;
        if (!priceMax.value && priceMin.value) {
            ExamineBookData = filterDatarr[0];
        }
        else if (!priceMin.value && priceMax.value) {
            ExamineBookData = filterDatarr[filterDatarr.length - 1];
        }
        else {
            ExamineBookData = filterDatarr[0];
        }
        console.log('Data for bookedExamine', ExamineBookData);
        let coverImage;
        if (ExamineBookData.coverImage) {
            coverImage = ExamineBookData.coverImage;
        }
        else {
            coverImage = defaultCoverUp;
        }
        searchBookId.innerHTML = `<b>${ExamineBookData === null || ExamineBookData === void 0 ? void 0 : ExamineBookData.bookId}</b>`;
        searchPrice.innerHTML = `<b>$ ${ExamineBookData === null || ExamineBookData === void 0 ? void 0 : ExamineBookData.price}</b>`;
        searchGenre.innerHTML = `<b>${ExamineBookData === null || ExamineBookData === void 0 ? void 0 : ExamineBookData.genre}</b>`;
        searchAuthor.innerHTML = `<b>${ExamineBookData === null || ExamineBookData === void 0 ? void 0 : ExamineBookData.author}</b>`;
        searchPublicationYear.innerHTML = `<b>${ExamineBookData === null || ExamineBookData === void 0 ? void 0 : ExamineBookData.publicationYear}</b>`;
        examinedThumbnail.src = coverImage;
        examinedThumbnail.style.display = 'block';
    }
    similarBooksDetails(filterDatarr[0]);
}
function filterData(val, filterType, currentData) {
    const lowerVal = typeof val === 'string' ? val.toLowerCase() : val;
    const getExactMatches = (key) => currentData.filter((book) => {
        return typeof book[key] === 'string' && book[key].toLowerCase() === lowerVal;
    });
    const getStartsWithMatches = (key) => currentData.filter((book) => {
        return typeof book[key] === 'string' && book[key].toLowerCase().startsWith(lowerVal);
    });
    const includesMatches = (key) => currentData.filter((book) => {
        return typeof book[key] === 'string' && book[key].toLowerCase().includes(lowerVal);
    });
    if (filterType === 'bookId') {
        const exactMatches = getExactMatches('bookId');
        if (exactMatches.length > 0) {
            console.log("aakki1", exactMatches);
            return exactMatches;
        }
        const startsWithMatches = getStartsWithMatches('bookId');
        if (startsWithMatches.length > 0) {
            return startsWithMatches;
        }
        const includesMatchesdata = includesMatches('bookId');
        if (includesMatchesdata.length > 0) {
            return includesMatchesdata;
        }
    }
    else if (filterType === 'genre') {
        const exactMatches = getExactMatches('genre');
        if (exactMatches.length > 0) {
            console.log("aakki2", exactMatches);
            return exactMatches;
        }
        const startsWithMatches = getStartsWithMatches('genre');
        if (startsWithMatches.length > 0) {
            return startsWithMatches;
        }
    }
    else if (filterType === 'priceMin') {
        let pricemin = currentData.filter((book) => book.price >= val);
        console.log("price-Min", pricemin);
        return pricemin;
    }
    else if (filterType === 'priceMax') {
        let pricemax = currentData.filter((book) => book.price <= val);
        console.log("price-Max", pricemax);
        return pricemax;
    }
    else if (filterType === 'author') {
        const exactMatches = getExactMatches('author');
        if (exactMatches.length > 0) {
            console.log("aakki3", exactMatches);
            return exactMatches;
        }
        const startsWithMatches = getStartsWithMatches('author');
        if (startsWithMatches.length > 0) {
            console.log("aakki3", startsWithMatches);
            return startsWithMatches;
        }
        const includesMatchesdata = includesMatches('author');
        if (includesMatchesdata.length > 0) {
            return includesMatchesdata;
        }
    }
    else if (filterType === 'publicationYear') {
        let publicyear = currentData.filter((book) => book.publicationYear.toString() === val);
        console.log("Year", publicyear);
        return publicyear;
    }
    return [];
}
;
function handleSearch() {
    let filteredData = arr_data;
    const filters = [
        { value: bookId.value, type: 'bookId' },
        { value: genre.value, type: 'genre' },
        { value: priceMin.value, type: 'priceMin' },
        { value: priceMax.value, type: 'priceMax' },
        { value: author.value, type: 'author' },
        { value: publicationYear.value, type: 'publicationYear' },
    ];
    filteredData = filters.reduce((acc, filter) => {
        return filter.value ? filterData(filter.value, filter.type, acc) : acc;
    }, filteredData);
    const isFiltered = filters.some(filter => filter.value);
    if (isFiltered) {
        filteredData.sort((a, b) => a.price - b.price);
        similarBook.style.display = 'block';
        console.log('Lit of data', filteredData);
        examinedBookDeatils(filteredData);
    }
    else {
        examinedBookDeatils([]);
    }
}
function paginateData(page) {
    const start = (page - 1) * rowsPage;
    const end = start + rowsPage;
    return arr_data.slice(start, end);
}
;
function renderPagination(totalPages) {
    const paginationElement = document.querySelector('.pagination');
    paginationElement.innerHTML = '';
    const createPageItem = (page, text) => {
        const li = document.createElement('li');
        li.classList.add('page-item');
        li.innerHTML = `<a class="page-link" href="#">${text}</a>`;
        if (page === currentPage) {
            li.classList.add('active');
        }
        li.addEventListener('click', (event) => {
            event.preventDefault();
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                const tableBody = document.querySelector('#table-all-books tbody');
                if (tableBody) {
                    tableBody.innerHTML = '';
                }
                allbooks();
            }
        });
        return li;
    };
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    paginationElement.appendChild(createPageItem(currentPage - 1, 'Prev'));
    for (let i = startPage; i <= endPage; i += 1) {
        paginationElement.appendChild(createPageItem(i, i));
    }
    paginationElement.appendChild(createPageItem(currentPage + 1, 'Next'));
}
function allbooks() {
    const bookstable = document.querySelector('#table-all-books tbody');
    bookstable.innerHTML = '';
    let tableData = paginateData(currentPage);
    tableData.forEach((ele) => {
        let bookImage;
        console.log(ele.coverImage);
        if (ele.coverImage) {
            bookImage = ele.coverImage;
        }
        else {
            bookImage = defaultCoverUp;
        }
        const newrow = document.createElement('tr');
        const imgTd = document.createElement('td');
        const img = document.createElement('img');
        img.alt = ele.bookName;
        img.setAttribute('data-src', bookImage);
        img.classList.add('lazy-img');
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.objectFit = 'contain';
        imgTd.appendChild(img);
        const nameTd = document.createElement('td');
        nameTd.textContent = ele.bookName;
        const priceTd = document.createElement('td');
        priceTd.textContent = `$ ${ele.price}`;
        const genreTd = document.createElement('td');
        genreTd.textContent = ele.genre;
        const yearTd = document.createElement('td');
        yearTd.textContent = ele.publicationYear.toString();
        const authorTd = document.createElement('td');
        authorTd.textContent = ele.author;
        newrow.appendChild(imgTd);
        newrow.appendChild(nameTd);
        newrow.appendChild(priceTd);
        newrow.appendChild(genreTd);
        newrow.appendChild(yearTd);
        newrow.appendChild(authorTd);
        bookstable.appendChild(newrow);
    });
    lazyLoadImages();
    const totalPages = Math.ceil(arr_data.length / rowsPage);
    renderPagination(totalPages);
}
dropDown.forEach((item) => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        const selectedValue = item.getAttribute('data-value');
        rowsPage = parseInt(selectedValue, 10);
        currentPage = 1;
        allbooks();
        console.log('Selected Value:', selectedValue);
    });
});
function dataBook() {
    const localData = localStorage.getItem('Data');
    if (localData) {
        const data = JSON.parse(localData);
        arr_data = data;
        return Promise.resolve(data);
    }
    return fetch(api_Url)
        .then((res) => {
        if (!res.ok) {
            throw new Error('Network respnse not work!!!!');
        }
        return res.json();
    })
        .then((ele) => {
        localStorage.setItem('Data', JSON.stringify(ele));
        arr_data = ele;
        return ele;
    })
        .catch((err) => {
        console.error("Error in fetching Book Data", err);
        return null;
    });
}
dataBook().then((ele) => {
    console.log("Aakash", ele);
}).then(allbooks);
