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

const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");

let heroIndex = 0;

function showHero(index){

    heroSlides.forEach((slide,i)=>{
        slide.classList.toggle("active",i===index);
    });

    heroDots.forEach((dot,i)=>{
        dot.classList.toggle("active",i===index);
    });

}

setInterval(()=>{

    heroIndex++;

    if(heroIndex>=heroSlides.length){
        heroIndex=0;
    }

    showHero(heroIndex);

},5000);

heroDots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        heroIndex=index;

        showHero(heroIndex);

    });

});