const works = document.querySelectorAll('.work-item');
const modal = document.getElementById('modal');
const modalInner = document.getElementById('modalInner');
const year = document.getElementById('year');
const filters = document.querySelectorAll('.filters button');

year.textContent = new Date().getFullYear();

/* FILTERS */

filters.forEach(btn => {
  btn.addEventListener('click', () => {

    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.filter;

    works.forEach(work => {
      if (category === 'all' || work.dataset.category === category) {
        work.style.display = 'block';
      } else {
        work.style.display = 'none';
      }
    });
  });
});

/* MODAL */

works.forEach(work => {
  work.addEventListener('click', () => {
    const video = work.dataset.video;

    modalInner.innerHTML = `
      <video src="${video}" autoplay controls playsinline></video>
    `;

    modal.classList.add('active');
  });
});

modal.addEventListener('click', () => {
  modal.classList.remove('active');
  modalInner.innerHTML = '';
});
