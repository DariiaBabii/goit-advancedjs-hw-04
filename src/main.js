import { getImage } from './pixabay-api.js';
import { renderGallery } from './render-gallery.js';

const searchForm = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('input[name="searchQuery"]');
const searchButton = document.querySelector('button[type="submit"]');

searchForm.addEventListener('submit', onFormSubmit, false);
loadMore.addEventListener('click', onLoadMore);
searchInput.addEventListener('input', onSearchInput, false);

let page = 1;
let query = '';
let isFirstSubmit = true;

function onSearchInput() {
  searchButton.disabled = searchInput.value.trim() === '';
}
searchButton.disabled = true;

const lightbox = new SimpleLightbox('.gallery a', {});

async function onFormSubmit(event) {
  event.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  loadMore.style.display = 'none';
  query = searchInput.value.trim();

  if (query.length === 0) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter your request.',
      position: 'topRight',
    });
    return;
  }
  isFirstSubmit = true;

  try {
    const response = await getImage(query, page);
    const { hits, totalHits } = response.data;
    if (hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again.',
        position: 'topRight',
      });
      return;
    }

    renderGallery(hits);
    lightbox.refresh();
    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${totalHits} images.`,
    });
    loadMore.style.display = 'block';
    if (!isFirstSubmit) {
      smoothScroll();
    } else {
      isFirstSubmit = false;
    }
    if (hits.length < 40) {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
      loadMore.style.display = 'none';
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  }
}

async function onLoadMore() {
  page++;
  query = searchInput.value.trim();
  try {
    const response = await getImage(query, page);
    const { hits } = response.data;
    renderGallery(hits);
    lightbox.refresh();
    if (hits.length < 40) {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
      loadMore.style.display = 'none';
    }
    smoothScroll();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images. Please try again later.',
      position: 'topRight',
    });
    console.error('Error in onLoadMore:', error);
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
