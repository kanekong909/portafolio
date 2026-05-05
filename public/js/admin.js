// ─── Search filter ───
const searchInput = document.getElementById('searchProjects');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.project-row').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ─── Image upload preview (múltiples) ───
const imageInput = document.getElementById('imageInput');
const newImgPreviews = document.getElementById('newImgPreviews');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadArea = document.getElementById('uploadArea');

if (imageInput) {
  imageInput.addEventListener('change', e => {
    newImgPreviews.innerHTML = '';
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = document.createElement('img');
        img.src = ev.target.result;
        newImgPreviews.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
    if (uploadPlaceholder) {
      uploadPlaceholder.style.display = e.target.files.length > 0 ? 'none' : '';
    }
  });
}

// ─── Drag & drop ───
if (uploadArea) {
  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    if (imageInput) {
      imageInput.files = e.dataTransfer.files;
      imageInput.dispatchEvent(new Event('change'));
    }
  });
}

// ─── Eliminar imágenes existentes ───
const removeImagesInput = document.getElementById('removeImages');
const toRemove = new Set();

document.querySelectorAll('.remove-img-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const index = parseInt(btn.dataset.index);
    const wrap = btn.closest('.existing-img-wrap');

    if (toRemove.has(index)) {
      // Si ya estaba marcada, desmarcar
      toRemove.delete(index);
      wrap.style.opacity = '1';
      wrap.style.pointerEvents = 'all';
      btn.textContent = '✕';
      btn.style.background = '';
    } else {
      // Marcar para eliminar
      toRemove.add(index);
      wrap.style.opacity = '0.3';
      wrap.style.pointerEvents = 'none';
      btn.textContent = '↩';
      btn.style.background = 'rgba(255,77,77,0.8)';
      btn.style.pointerEvents = 'all';
    }

    if (removeImagesInput) {
      removeImagesInput.value = Array.from(toRemove).join(',');
    }
  });
});