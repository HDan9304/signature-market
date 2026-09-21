const announcements = document.querySelectorAll(".announcement");

const next = document.getElementById("next");
const prev = document.getElementById("prev");

let current = 0;

function showSlide(index){

announcements.forEach(item=>{
item.classList.remove("active");
});

announcements[index].classList.add("active");

}

next.addEventListener("click",()=>{

current++;

if(current>=announcements.length){
current=0;
}

showSlide(current);

});

prev.addEventListener("click",()=>{

current--;

if(current<0){
current=announcements.length-1;
}

showSlide(current);

});

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
});

function closeCart() {
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

let heroSlides = [];
let heroDots = [];
let heroIndex = 0;
let heroInterval;

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

if (window.lucide) {
    lucide.createIcons();
}