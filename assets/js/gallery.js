const FOLDER_ID = '1VzuJ_hV2mKpHDOuJOxp--4e_PjheZQUK';
const API_KEY = 'AIzaSyDU0vZN_AE1glGIMEZO42xAdJzOMkjYPfA';

const albumsContainer = document.getElementById('albums-container');
const imagesContainer = document.getElementById('images-container');
const filterYear = document.getElementById('filter-year');
const searchInput = document.getElementById('search-input');

let allImages = [];
let albums = {};
let years = new Set();

async function fetchDrive(url) {
  const res = await fetch(url + `&key=${API_KEY}`);
  return res.json();
}

/* -------- ALBUMS -------- */

async function loadAlbums() {
  const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)`;
  const data = await fetchDrive(url);

  for (const folder of data.files) {
    albums[folder.id] = { name: folder.name, images: [] };
    await loadImages(folder.id, folder.name);
    renderAlbum(folder);
  }

  populateYearFilter();
  renderImages();
}

/* -------- IMAGES -------- */

async function loadImages(folderId, albumName) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,createdTime,mimeType,imageMediaMetadata)`;
  const data = await fetchDrive(url);

  data.files.forEach(file => {
    if (!file.mimeType?.startsWith('image/')) return;

    const year = new Date(file.createdTime).getFullYear();
    years.add(year);

    const image = {
      id: file.id,
      year,
      album: albumName,
      caption: `Members at ${albumName}`,
      url: `https://drive.google.com/uc?export=view&id=${file.id}`
    };

    albums[folderId].images.push(image);
    allImages.push(image);
  });
}

/* -------- RENDER -------- */

function renderAlbum(folder) {
  const div = document.createElement('div');
  div.className = 'album-card bg-white rounded shadow p-4';
  div.innerHTML = `
    <h3 class="font-semibold">${folder.name}</h3>
    <p class="text-sm text-gray-500">${albums[folder.id].images.length} photos</p>
  `;
  div.onclick = () => filterByAlbum(folder.name);
  albumsContainer.appendChild(div);
}

function renderImages() {
  imagesContainer.innerHTML = '';

  const query = searchInput.value.toLowerCase();
  const year = filterYear.value;

  allImages
    .filter(img =>
      (!year || img.year == year) &&
      img.album.toLowerCase().includes(query)
    )
    .forEach(img => {
      const div = document.createElement('div');
      div.className = 'image-card';
      div.innerHTML = `
        <img src="${img.url}" class="rounded mb-2">
        <p class="text-sm text-center">${img.caption}</p>
      `;
      div.onclick = () => openModal(img);
      imagesContainer.appendChild(div);
    });
}

/* -------- FILTERS -------- */

function populateYearFilter() {
  [...years].sort().forEach(y => {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    filterYear.appendChild(opt);
  });
}

function filterByAlbum(name) {
  searchInput.value = name;
  renderImages();
}

searchInput.oninput = renderImages;
filterYear.onchange = renderImages;

/* -------- MODAL -------- */

function openModal(img) {
  document.getElementById('modal-image').src = img.url;
  document.getElementById('modal-caption').textContent = img.caption;
  document.getElementById('image-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('image-modal').classList.add('hidden');
}

/* -------- INIT -------- */

loadAlbums();
