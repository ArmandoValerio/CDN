let currentImageId = null;

document.addEventListener('DOMContentLoaded', async () => {
    await fetchImages();
});

document.getElementById('uploadButton').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    if (imageInput.files.length === 0) {
        alert('Please select an image to upload');
        return;
    }

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    try {
        const response = await fetch('/api/images', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert('Image uploaded successfully');
        await fetchImages();
    } catch (error) {
        alert('Error uploading image');
    }
});

async function fetchImages() {
    try {
        const response = await fetch('/api/images');
        const images = await response.json();
        const imageList = document.getElementById('imageList');
        imageList.innerHTML = '';
        images.result.forEach(image => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${image.variants[0]}" alt="Image" width="250" onclick="openModal('${image.id}')">
            `;
            imageList.appendChild(listItem);
        });
    } catch (error) {
        alert('Error fetching images');
    }
}

function openModal(imageId) {
    currentImageId = imageId;
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = `https://imagedelivery.net/jJ__hVGQz0ODLVphVt4EtA/${imageId}/250`;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

async function deleteImage(imageId) {
    try {
        const response = await fetch(`/api/images/${imageId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        alert('Image deleted successfully');
        closeModal();
        await fetchImages();
    } catch (error) {
        alert('Error deleting image');
    }
}

async function changeVariant(imageId, size) {
    const imageUrl = `https://imagedelivery.net/jJ__hVGQz0ODLVphVt4EtA/${imageId}/${size}`;
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageUrl;
}

// Close the modal when the user clicks on <span> (x)
document.querySelector('.close').onclick = function() {
    closeModal();
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
        closeModal();
    }
}