// ─── Search filter ───
const searchInput = document.getElementById('searchProjects');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.project-row').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// ─── Image upload preview ───
const imageInput = document.getElementById('imageInput');
const imgPreview = document.getElementById('imgPreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadArea = document.getElementById('uploadArea');

if (imageInput) {
  imageInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      imgPreview.src = ev.target.result;
      imgPreview.style.display = 'block';
      if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });
}

if (uploadArea) {
  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && imageInput) {
      const dt = new DataTransfer();
      dt.items.add(file);
      imageInput.files = dt.files;
      imageInput.dispatchEvent(new Event('change'));
    }
  });
}
