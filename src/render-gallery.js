const gallery = document.querySelector('.gallery');

export function renderGallery(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
       <a href="${largeImageURL}" class="card-link">
          <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image" />
        <div class="info">
          <p class="info-item"><b>Likes</b>${likes}</p>
          <p class="info-item"><b>Views</b>${views}</p>
          <p class="info-item"><b>Comments</b>${comments}</p>
          <p class="info-item"><b>Downloads</b>${downloads}</p>
        </div>
      </div>
      </a>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}