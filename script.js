const cards = document.querySelectorAll('.work-card');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

cards.forEach(card => {
  card.addEventListener('click', () => {
    const src = card.dataset.video;

    modalContent.innerHTML = `
      <video src="${src}" autoplay muted controls playsinline></video>
    `;

    modal.classList.add('active');
  });
});

modal.addEventListener('click', () => {
  modal.classList.remove('active');
  modalContent.innerHTML = '';
});
