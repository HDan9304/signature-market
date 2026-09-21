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