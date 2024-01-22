var username;
var id;
window.onload = function(){
    if(localStorage.getItem('username')){
        username = localStorage.getItem('username');
        id = localStorage.getItem('id');
        console.log(username);
        console.log(id);
    }
    else{
        console.log(false);
    }
}


let currentSlide = 0;

function changeSlide(n) {
    showSlide(currentSlide += n);
}

function showSlide(n) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;

    if (n >= totalSlides) {
        currentSlide = 0;
    } else if (n < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = n;
    }

    slides.style.transform = `translateX(${-currentSlide * 100}%)`;
}

function mine(){
    if(window.username != null && window.id != null){
        if(username == "root"){
            window.location.href = "./manage/manage.html"; 
        }
        else{
            window.location.href = "./mine/mine.html"; 
        }
    }
    else{
        window.location.href = './login/login.html';
    }
}