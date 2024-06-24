import { getImage } from './pixabay-api.js';
import { renderGallery } from './render-gallery.js';

const searchForm = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('input[name="searchQuery"]');
const searchButton = document.querySelector('button[type="submit"]');

searchForm.addEventListener('submit', onFormSubmit, false);
searchInput.addEventListener('input', onSearchInput, false);
loadMore.addEventListener('click', onLoadMore);

let page = 1;

const lightbox = new SimpleLightbox('.gallery a', {});

async function onFormSubmit(event) {
  event.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  const query = searchInput.value;
  loadMore.style.display = 'none';
  try {
    const response = await getImage(query, page);
    const { hits, totalHits } = response.data;
    if (hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again.',
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
    smoothScroll();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
    });
    console.error(error);
  }
}

async function onLoadMore() {
  page++;
  const query = searchInput.value;
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

function onSearchInput() {
  searchButton.disabled = searchInput.value.trim() === '';
}
