// carrousel.js - loads carrousel.json and injects slides into the DOM

async function loadSlides() {
    try {
        const res = await fetch('carrousel.json');
        if (!res.ok) throw new Error('Unable to load carrousel.json');
        const data = await res.json();
        const slides = data.realisation || [];
        populateSlider(slides);
    } catch (err) {
        console.error(err);
    }
}

function createCardElement(slide) {
    const container = document.createElement('div');
    container.className = 'carte-item';

    const imageLink = document.createElement('a');
    imageLink.href = '#';
    imageLink.className = 'carte-image-link';

    const image = document.createElement('img');
    image.src = slide.img || '';
    image.alt = slide.nom || '';
    image.className = 'carte-image';
    imageLink.appendChild(image);

    const info = document.createElement('div');
    info.className = 'card-info';

    const typeLabel = document.createElement('p');
    typeLabel.className = 'type';
    typeLabel.textContent = slide.type || '';
    info.appendChild(typeLabel);

    const titleRow = document.createElement('div');
    titleRow.className = 'card-header';

    const title = document.createElement('h2');
    title.className = 'carte-titre';
    title.textContent = slide.nom || '';
    titleRow.appendChild(title);

    const duration = document.createElement('p');
    duration.className = 'duree';
    duration.textContent = slide['durée'] || slide.duree || '';
    titleRow.appendChild(duration);

    info.appendChild(titleRow);

    const tags = [slide['tag-1'], slide['tag-2'], slide['tag-3']].filter(Boolean).join(' ');
    if (tags) {
        const tagText = document.createElement('p');
        tagText.className = 'tag';
        tagText.textContent = tags;
        info.appendChild(tagText);
    }

    const button = document.createElement('button');
    button.className = 'carte-bouton material-symbols-outlined';
    button.textContent = 'arrow_right_alt';
    info.appendChild(button);

    container.appendChild(imageLink);
    container.appendChild(info);
    return container;
}

function initScrollReveal() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                carousel.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(carousel);
}

function populateSlider(slides) {
    const track = document.getElementById('slider-track');
    const dotsContainer = document.getElementById('carousel-dots');

    slides.forEach((slide) => {
        const card = createCardElement(slide);
        const item = document.createElement('li');
        item.className = 'slide';
        item.appendChild(card);
        track.appendChild(item);
    });

    const items = Array.from(track.querySelectorAll('.slide'));
    let visibleCount = getVisibleCount();
    let maxIndex = Math.max(0, items.length - visibleCount);
    let current = 0;

    function getVisibleCount() {
        const width = window.innerWidth;
        if (width < 720) return 1;
        return 2;
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= maxIndex; i += 1) {
            const dot = document.createElement('button');
            dot.className = 'dot';
            if (i === current) dot.classList.add('active');
            dot.addEventListener('click', () => {
                current = i;
                update();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function update() {
        if (!items.length) return;
        visibleCount = getVisibleCount();
        maxIndex = Math.max(0, items.length - visibleCount);
        current = Math.min(current, maxIndex);

        const slideWidth = items[0].getBoundingClientRect().width;
        const gap = parseInt(getComputedStyle(track).gap, 10) || 24;
        track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;

        const activeCenter = Math.min(current + Math.floor(visibleCount / 2), items.length - 1);
        items.forEach((item, index) => {
            item.classList.toggle('active', index === activeCenter);
        });

        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === current);
        });
    }

    document.getElementById('slider-prev').addEventListener('click', () => {
        current = current > 0 ? current - 1 : maxIndex;
        update();
    });

    document.getElementById('slider-next').addEventListener('click', () => {
        current = current < maxIndex ? current + 1 : 0;
        update();
    });

    window.addEventListener('resize', update);
    createDots();
    update();
    initScrollReveal();

    let autoplay = setInterval(() => {
        current = current < maxIndex ? current + 1 : 0;
        update();
    }, 4500);

    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
        carousel.addEventListener('mouseleave', () => {
            autoplay = setInterval(() => {
                current = current < maxIndex ? current + 1 : 0;
                update();
            }, 4500);
        });
    }
}

window.addEventListener('DOMContentLoaded', loadSlides);
