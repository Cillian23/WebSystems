document.addEventListener('DOMContentLoaded', () => {
console.log("Running");
const viewTopic = document.querySelector('button[name="topic"]');
const studentTopic = document.querySelector('.topic');
const editPro = document.querySelector('button.prof');
const profile = document.querySelector('div[name="prof"]');
const profcanc = document.querySelector('button[name="cancel"]');

//Add event listener

viewTopic.addEventListener('click', () => {
    
    if(studentTopic.classList.contains('inactive')){
        studentTopic.classList.remove('inactive');
        studentTopic.classList.add('active');
    }
   else if(studentTopic.classList.contains('active')){
        studentTopic.classList.remove('active');
        studentTopic.classList.add('inactive');
    }
    
});

editPro.addEventListener('click', () => {
    console.log("clicked");
    if(profile.classList.contains('inactive')){
        profile.classList.remove('inactive');
        profile.classList.add('active');
    }
  /* else if(profile.classList.contains('active')){
        profile.classList.remove('active');
        profile.classList.add('inactive');
    }*/
});

profcanc.addEventListener('click', () => {
    if(profile.classList.contains('active')){
        profile.classList.remove('active');
        profile.classList.add('inactive');
    }
})
});