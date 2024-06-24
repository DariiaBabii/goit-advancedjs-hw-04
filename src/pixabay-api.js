// import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const pageSize = 40;

export async function getImage(query, page) {
  try {
    const resp = await axios.get(URL, {
      params: {
        key: '44570519-7c0b61377156fc3d5e2c8fcbc',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: pageSize,
        page,
      },
    });
    return resp;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
