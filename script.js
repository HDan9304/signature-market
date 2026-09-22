const announcements = document.querySelectorAll(".announcement");
const announcementProgress = document.getElementById("announcementProgress");

const next = document.getElementById("next");
const prev = document.getElementById("prev");

let current = 0;

function showSlide(index){

announcements.forEach(item=>{
item.classList.remove("active");
});

announcements[index].classList.add("active");

if (announcementProgress) {

    announcementProgress.getAnimations().forEach(animation => animation.cancel());

    announcementProgress.animate(
        [
            { transform: "scaleX(0)" },
            { transform: "scaleX(1)" }
        ],
        {
            duration: 8000,
            easing: "linear",
            fill: "forwards"
        }
    );

}

}

if (next) {
    next.addEventListener("click", () => {

        current++;

        if (current >= announcements.length) {
            current = 0;
        }

        showSlide(current);

    });
}

if (prev) {
    prev.addEventListener("click", () => {

        current--;

        if (current < 0) {
            current = announcements.length - 1;
        }

        showSlide(current);

    });
}

// Auto slide every 5 seconds

setInterval(()=>{

current++;

if(current>=announcements.length){
current=0;
}

showSlide(current);

},8000);


const cartToggle = document.getElementById("cartToggle");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");

cartToggle.addEventListener("click", () => {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("show");

    cartDrawer.classList.remove("animate");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            cartDrawer.classList.add("animate");
        });
    });
});

function closeCart() {
    cartDrawer.classList.remove("animate");
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("show");
}

cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeCart();
    }
});

const heroSlidesContainer = document.getElementById("heroSlides");
const heroDotsContainer = document.getElementById("heroDots");
const heroProgress = document.getElementById("heroProgress");
const heroCarousel = document.querySelector(".hero-carousel");

let heroSlides = [];
let heroDots = [];
let heroIndex = 0;
let heroInterval;

let touchStartX = 0;
let touchEndX = 0;

fetch("assets/banners/banners.json")
.then(response => {

    if (!response.ok) {
        throw new Error("Unable to load banners.json");
    }

    return response.json();

})
.then(banners => {

    if (!Array.isArray(banners)) {
        throw new Error("banners.json must contain an array.");
    }

    banners = banners.filter(banner => banner && banner.image);

    if (banners.length === 0) {
        throw new Error("No banners found.");
    }

    banners.forEach((banner, index) => {

        const slide = document.createElement("div");
        slide.className = "hero-slide";

        if(index === 0){
            slide.classList.add("active");
        }

        slide.innerHTML = `
            <img src="assets/banners/${banner.image}" alt="${banner.title}">
        `;

        heroSlidesContainer.appendChild(slide);

heroSlides.push(slide);

const dot = document.createElement("button");
dot.className = "hero-dot";

        if(index === 0){
            dot.classList.add("active");
        }

        dot.onclick = () => {

            heroIndex = index;

            showHero(heroIndex);

            restartHero();

        };

        heroDotsContainer.appendChild(dot);

heroDots.push(dot);

    });

    heroIndex = 0;

showHero(heroIndex);

heroInterval = setInterval(nextHero,5000);

})
.catch(error => {

    console.error("Hero Carousel Error:", error);

    heroSlidesContainer.innerHTML = `
        <div style="
            display:flex;
            align-items:center;
            justify-content:center;
            height:100%;
            padding:24px;
            text-align:center;
            color:#666;
            font-size:14px;
        ">
            Failed to load banners.<br>
            Open the browser console (F12 → Console) to see the error.
        </div>
    `;

});

function showHero(index){

    heroSlides.forEach((slide,i)=>{
        slide.classList.toggle("active",i===index);
    });

    heroDots.forEach((dot,i)=>{
        dot.classList.toggle("active",i===index);
    });

    if(heroProgress){

        heroProgress.getAnimations().forEach(animation => animation.cancel());

        heroProgress.animate(
            [
                { transform:"scaleX(0)" },
                { transform:"scaleX(1)" }
            ],
            {
                duration:5000,
                easing:"linear",
                fill:"forwards"
            }
        );
    }

}

function nextHero(){

    if(heroSlides.length <= 1){
        return;
    }

    heroIndex = (heroIndex + 1) % heroSlides.length;

    showHero(heroIndex);

}

function restartHero(){

    clearInterval(heroInterval);

    heroInterval = setInterval(nextHero,5000);

}

if(heroCarousel){

    heroCarousel.addEventListener("touchstart", event=>{
        touchStartX = event.changedTouches[0].clientX;
    },{passive:true});

    heroCarousel.addEventListener("touchend", event=>{

        touchEndX = event.changedTouches[0].clientX;

        const distance = touchStartX - touchEndX;

        if(Math.abs(distance) < 40){
            return;
        }

        if(distance > 0){
            nextHero();
        }else{
            heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
            showHero(heroIndex);
        }

        restartHero();

    },{passive:true});

}

const siteHeader = document.querySelector(".site-header");

if(siteHeader && heroCarousel){

    function updateHeader(){

        const trigger =
            heroCarousel.offsetTop + heroCarousel.offsetHeight;

        siteHeader.classList.toggle(
            "scrolled",
            window.scrollY > trigger
        );
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, { passive:true });
    window.addEventListener("resize", updateHeader);
}

if (window.lucide) {
    lucide.createIcons();
}