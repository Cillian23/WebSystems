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
const popCanc = document.querySelector('button.popbtn');
let theStatus=0;
 // To distinguish between popup on different pages, arbtitrarily; student=0, secretary=1, instructor=2

//Add event listeners for student page, only work if popup menu is currently inactive----------------------------------------------------------------------

popCanc.addEventListener('click', () => {     //Adding X out button for each menu, which turns off all menus, stops buttons interfering with each other 
    
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
        studentTopic.classList.remove('active');
        profile.classList.remove('active');
        thesStatus[theStatus].classList.remove('active');
        studentTopic.classList.add('inactive');
        profile.classList.add('inactive');
        thesStatus[theStatus].classList.add('inactive');
});

//Student page buttons -------------------------------------------------------------------------------------------------------------------------------
viewTopic.addEventListener('click', () => {      //Button for viewing thesis topic
    if(popVisi.classList.contains('inactive')){

        studentTopic.classList.toggle('active');
        studentTopic.classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
    }       
});

editPro.addEventListener('click', () => {     // Button for editing profile details
    console.log("clicked");
    if(popVisi.classList.contains('inactive')){

        profile.classList.toggle('active');
        profile.classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
    }
});

profcanc.addEventListener('click', () => {   // Button for cancelling edit profile
        profile.classList.toggle('active');
        popVisi.classList.toggle('active');
        profile.classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
})


viewThesis.addEventListener('click', () => {  //Button for viewing thesis status, array as depends on current thesis status, arbitrary variable at the moment
    if(popVisi.classList.contains('inactive')){

        thesStatus[theStatus].classList.toggle('active');
        thesStatus[theStatus].classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
    }  
});




//Endpoint
});