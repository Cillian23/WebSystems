//SET-UP ---------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
console.log("Running");
const viewTopic = document.querySelector('button.men.viewtop');
const studentTopic = document.querySelector('.topic');
const editPro = document.querySelector('button.men.prof');
const profile = document.querySelector('.deets');
const profcanc = document.querySelector('button[name="cancel"]');
const profSave = document.querySelector('button[name="SaveDeets"]');
const viewThesis = document.querySelector('button.men.thes');
const thesStatus = document.querySelectorAll('.thesis');
const popVisi = document.querySelector('.popup');
const popCanc = document.querySelector('button.popbtn');
let theStatus=0;
// Retreiving username and password from local storage as an object, helps in fetch call -------------------------------------------------------------------------------

/*const userData1 = {
  username: localStorage.getItem('username')
  //id: localStorage.getItem('IDnumber'),

};*/
//console.log(userData.username);

var IDnumber = {      //initialise the variable for id number 
 stud_id: localStorage.getItem('IDnumber')
 } 

 var ProfDetails = {   //initialise the variable for profile details
  PostAddr: localStorage.getItem('PostAddr'),
  email: localStorage.getItem('Email'),
  mobileNum: localStorage.getItem('mobileNum'),
  landlineNum: localStorage.getItem('landlineNum')
 }
 console.log(ProfDetails);
//Fetch data from database through api address, currently just gets all students in database ------------------------------------------------------------------------


/*fetch('http://localhost:3000/api/users', username)           OLD FETCH CODE, KEEPING AS TEMPLATE FOR NOW
  .then(res => res.json())
  .then(data => {
    console.log(data); // handle it in DOM
  })
  .catch(err => console.error(err));*/


// Actual fetch code, passes in username and password
/*fetch('http://localhost:3000/api/users/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(userData1)                  //pass in string version of data from the user object
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
    ProfDetails.PostAddr=data[0].PostAddr;
    ProfDetails.email=data[0].email;
    ProfDetails.mobileNum=data[0].mobileNum;
    ProfDetails.landlineNum=data[0].landlineNum;
    }
  })
  .catch(err => console.error('Error:', err));  //catch errors
*/

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
    console.log(ProfDetails);
    if(popVisi.classList.contains('inactive')){   //Turn popup active to make it appear

        profile.classList.toggle('active');
        profile.classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
    }
    document.getElementById('PostAddress').placeholder=ProfDetails.PostAddr;  //Replace placeholders with data from student's database
    document.getElementById('StudEmail').placeholder=ProfDetails.email;
    document.getElementById('mobileNumber').placeholder=ProfDetails.mobileNum;
    document.getElementById('landlineNumber').placeholder=ProfDetails.landlineNum;
    console.log(document.getElementById('PostAddress').value);
});

profcanc.addEventListener('click', () => {   // Button for cancelling edit profile
        profile.classList.toggle('active');
        popVisi.classList.toggle('active');
        profile.classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
})


profSave.addEventListener('click', () => {   //Button for saving new profile details
  console.log(document.getElementById('PostAddress').value);
  console.log(document.getElementById('StudEmail').value);
  console.log(document.getElementById('mobileNumber').value);
  console.log(document.getElementById('landlineNumber').value);
  //This section checks if there is a new input, updates values if so, using != '', as '' is not considered null. FINALLY WORKING!!!---------------------------------------- 
  if(document.getElementById('PostAddress').value != '') {
    ProfDetails.PostAddr = document.getElementById('PostAddress').value;
  }
  if(document.getElementById('StudEmail').value != '') {
    console.log('acting');
    ProfDetails.email = document.getElementById('StudEmail').value;
  }
  if(document.getElementById('mobileNumber').value != '') {
    ProfDetails.mobileNum = document.getElementById('mobileNumber').value;
  }
  if(document.getElementById('landlineNumber').value != '') {
    ProfDetails.landlineNum = document.getElementById('landlineNumber').value;
  }
console.log(ProfDetails);
//Now when they press save, send new values to database, or old values if not updated-------------------------------------------------------------------------------------------
 //Work in Progress
    fetch('http://localhost:3000/api/users/UpdateStudDeets', {  //Send saved data to backend, where it updates database
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(ProfDetails)                  //pass in string version of data from the profile details object
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
    console.log(data);     //print returned data in console, just saying sql message that it's changed
  })
  .catch(err => console.error('Error:', err));

//Close menu after saving details ----------------------------------------------------------------------------------------------------------
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