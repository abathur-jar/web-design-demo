const items = document.querySelectorAll('.work__item');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

items.forEach(item => {
  item.addEventListener('click', () => {
    const src = item.dataset.src;
    modalContent.innerHTML = `
      <video src="${src}" controls autoplay></video>
    `;
    modal.classList.add('active');
  });
});

modal.addEventListener('click', () => {
  modal.classList.remove('active');
  modalContent.innerHTML = '';
});
