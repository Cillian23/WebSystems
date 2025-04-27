document.addEventListener('DOMContentLoaded', () => {
console.log("Running");
const viewTopic = document.querySelector('button.men.viewtop');
const studentTopic = document.querySelector('.topic');
const editPro = document.querySelector('button.men.prof');
const profile = document.querySelector('.deets');
const profcanc = document.querySelector('button[name="cancel"]');
const viewThesis = document.querySelector('button.men.thes');
const thesStatus = document.querySelectorAll('.thesis');
const popVisi = document.querySelector('.popup');
let theStatus=0;

//Add event listeners for student page, these don't work properly yet, messed up when click one of the other buttons to close a menu

viewTopic.addEventListener('click', () => {
    
        studentTopic.classList.toggle('active');
        popVisi.classList.toggle('active');
        studentTopic.classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
});

editPro.addEventListener('click', () => {
    console.log("clicked");
    /*if(profile.classList.contains('inactive')){
        profile.classList.remove('inactive');
        profile.classList.add('active');
    }*/
        profile.classList.toggle('active');
        popVisi.classList.toggle('active');
        profile.classList.toggle('inactive');
        popVisi.classList.toggle('inactive');

});

profcanc.addEventListener('click', () => {
   /* if(profile.classList.contains('active')){
        profile.classList.remove('active');
        profile.classList.add('inactive');
    }*/
        profile.classList.toggle('active');
        popVisi.classList.toggle('active');
        profile.classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
})


viewThesis.addEventListener('click', () => {
    
        thesStatus[theStatus].classList.toggle('active');
        popVisi.classList.toggle('active');
        thesStatus[theStatus].classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
    
});


//Endpoint
});