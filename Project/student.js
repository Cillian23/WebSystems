//SET-UP ---------------------------------------------------------------------------------------------------------------------------------------------------------------
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
// Retreiving username and password from local storage as an object, helps in fetch call -------------------------------------------------------------------------------

const userData = {
  username: localStorage.getItem('username'),
  password: localStorage.getItem('password')
};
console.log(userData.username);

var IDnumber = {
 stud_id: null
 } //initialise the variable for id number 
//Fetch data from database through api address, currently just gets all students in database ------------------------------------------------------------------------


/*fetch('http://localhost:3000/api/users', username)           OLD FETCH CODE, KEEPING AS TEMPLATE FOR NOW
  .then(res => res.json())
  .then(data => {
    console.log(data); // handle it in DOM
  })
  .catch(err => console.error(err));*/


// Actual fetch code, passes in username and password
fetch('http://localhost:3000/api/users/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(userData)                  //pass in string version of data from the user object
})
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);   //error if fetch result doesn't work
    }
    else {
    return res.json();   //if it works return json version
    }
  })
  .then(data => {
    if (data[0] == null){
      location.href = 'index.html';       //return to login screen if not valid user, maybe move this into login page, so next page never loads at all, probs have to for staff users sake
    }
    else {
    console.log(data);     //print returned data
    IDnumber.stud_id = data[0].id;
    console.log(IDnumber.stud_id);
    }
  })
  .catch(err => console.error('Error:', err));  //catch errors

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
    fetch('http://localhost:3000/api/users/thesis', {  //Fetch data for thesis, currrently only prints it in console
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(IDnumber)                  //pass in string version of data from the user object
}) 
.then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);   //error if fetch result doesn't work
    }
    else {
    return res.json();   //if it works return json version
    }
  })
  .then(data => {
    console.log(data);     //print returned data
  })
  .catch(err => console.error('Error:', err));
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