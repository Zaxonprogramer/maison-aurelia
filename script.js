const intro = document.querySelector("#intro");
const website = document.querySelector("#website");
const hero = document.querySelector(".hero");
const experienceImage = document.querySelector(".experience-image");
const menuImage = document.querySelector(".menu-image-inner");

const reservationModal = document.querySelector("#reservation-modal");
const reservationTriggers = document.querySelectorAll(".reservation-trigger");
const reservationCloseButtons = document.querySelectorAll("[data-close-reservation]");
const reservationForm = document.querySelector("#reservation-form");
const reservationDate = document.querySelector("#reservation-date");
const reservationName = document.querySelector("#reservation-name");

const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileNavigation = document.querySelector(".mobile-navigation");
const mobileNavigationLinks = document.querySelectorAll(".mobile-navigation-links a");

const introElements = {
    eyebrow: document.querySelector(".intro-small"),
    title: document.querySelector(".intro-title"),
    line: document.querySelector(".intro-line"),
    location: document.querySelector(".intro-location")
};

const buildingLines = document.querySelectorAll(".building-lines path");
const dishes = document.querySelectorAll(".dish");

const revealElements = document.querySelectorAll(
    ".about-number, .about-heading, .about-text, .menu-section, .menu-content, .dish, .experience-image, .experience-caption"
);

const wait = (duration) =>
    new Promise((resolve) => setTimeout(resolve, duration));

let menuImageTimer;
let lastFocusedElement = null;

function setBodyScrollLocked(locked) {
    document.body.style.overflow = locked ? "hidden" : "auto";
}

function drawRestaurant() {
    buildingLines.forEach((line, index) => {
        line.style.transition =
            `stroke-dashoffset 1.8s cubic-bezier(.65, 0, .35, 1) ${index * 90}ms`;

        line.style.strokeDashoffset = "0";
    });
}

function revealWebsite() {
    intro.style.transition =
        "transform 1400ms cubic-bezier(.76, 0, .24, 1), opacity 1000ms ease";

    intro.style.transform = "translateY(-100%)";
    intro.style.opacity = "0";

    website.classList.add("is-ready");
    setBodyScrollLocked(false);

    setTimeout(() => {
        intro.remove();
    }, 1500);
}

async function playIntro() {
    await wait(400);

    drawRestaurant();

    introElements.eyebrow.style.transition = "opacity 800ms ease";
    introElements.eyebrow.style.opacity = "1";

    await wait(500);

    introElements.title.style.transition =
        "opacity 1000ms ease, transform 1000ms cubic-bezier(.16, 1, .3, 1)";

    introElements.title.style.opacity = "1";
    introElements.title.style.transform = "translateY(0)";

    await wait(800);

    introElements.line.style.transition =
        "width 1000ms cubic-bezier(.16, 1, .3, 1)";

    introElements.line.style.width = "160px";

    await wait(700);

    introElements.location.style.transition = "opacity 700ms ease";
    introElements.location.style.opacity = "1";

    await wait(1100);

    revealWebsite();
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } else {
                entry.target.classList.remove("is-visible");
            }
        });
    },
    {
        threshold: 0.18
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

function updateParallax() {
    const scrollY = window.scrollY;

    if (hero) {
        hero.style.backgroundPosition =
            `center calc(50% + ${scrollY * 0.12}px)`;
    }

    if (experienceImage) {
        const rect = experienceImage.getBoundingClientRect();
        const offset = (window.innerHeight - rect.top) * 0.06;

        experienceImage.style.backgroundPosition =
            `center calc(50% + ${offset}px)`;
    }
}

function changeMenuImage(dish) {
    const image = dish.dataset.image;

    if (!image || !menuImage) return;

    clearTimeout(menuImageTimer);

    menuImage.style.opacity = "0.65";
    menuImage.style.transform = "scale(1.04)";

    menuImageTimer = setTimeout(() => {
        menuImage.style.backgroundImage = `url("${image}")`;
        menuImage.style.opacity = "1";
        menuImage.style.transform = "scale(1)";
    }, 180);
}

function openMobileNavigation() {
    if (!mobileNavigation || !mobileMenuToggle) return;

    mobileNavigation.classList.add("is-open");
    mobileMenuToggle.classList.add("is-open");

    mobileNavigation.setAttribute("aria-hidden", "false");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    mobileMenuToggle.setAttribute("aria-label", "Close navigation");

    setBodyScrollLocked(true);
}

function closeMobileNavigation() {
    if (!mobileNavigation || !mobileMenuToggle) return;

    mobileNavigation.classList.remove("is-open");
    mobileMenuToggle.classList.remove("is-open");

    mobileNavigation.setAttribute("aria-hidden", "true");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.setAttribute("aria-label", "Open navigation");

    if (!reservationModal?.classList.contains("is-open")) {
        setBodyScrollLocked(false);
    }
}

function toggleMobileNavigation() {
    if (mobileNavigation?.classList.contains("is-open")) {
        closeMobileNavigation();
    } else {
        openMobileNavigation();
    }
}

function openReservation() {
    if (!reservationModal) return;

    lastFocusedElement = document.activeElement;

    closeMobileNavigation();

    reservationModal.classList.add("is-open");
    reservationModal.setAttribute("aria-hidden", "false");

    setBodyScrollLocked(true);

    requestAnimationFrame(() => {
        reservationName?.focus();
    });
}

function closeReservation() {
    if (!reservationModal?.classList.contains("is-open")) return;

    reservationModal.classList.remove("is-open");
    reservationModal.setAttribute("aria-hidden", "true");

    setBodyScrollLocked(false);

    lastFocusedElement?.focus();
}

function setMinimumReservationDate() {
    if (!reservationDate) return;

    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60_000;

    const localDate = new Date(today.getTime() - timezoneOffset)
        .toISOString()
        .split("T")[0];

    reservationDate.min = localDate;
}

dishes.forEach((dish) => {
    dish.addEventListener("mouseenter", () => {
        changeMenuImage(dish);
    });

    dish.addEventListener("click", () => {
        changeMenuImage(dish);
    });
});

mobileMenuToggle?.addEventListener("click", toggleMobileNavigation);

mobileNavigationLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
});

reservationTriggers.forEach((trigger) => {
    trigger.addEventListener("click", openReservation);
});

reservationCloseButtons.forEach((button) => {
    button.addEventListener("click", closeReservation);
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (reservationModal?.classList.contains("is-open")) {
        closeReservation();
        return;
    }

    closeMobileNavigation();
});

reservationForm?.addEventListener("submit", (event) => {
    event.preventDefault();
});

window.addEventListener(
    "scroll",
    updateParallax,
    {
        passive: true
    }
);

setMinimumReservationDate();
playIntro();