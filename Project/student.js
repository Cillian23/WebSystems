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
const SelectInstructors = document.querySelector('button[name="SubProfs"]');
let theStatus=0;
// Retreiving username and details from local storage as an object, helps in fetch calls -------------------------------------------------------------------------------
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
    fetch('http://localhost:3000/api/users/thesis1', {  
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
  .then(data => {                  //Change thesis details displayed to relevant student's
    console.log(data);  
    if (data[0].topic == null){    //If statements so it only displays when there is actually content to display
      document.getElementById('topicVAR').innerText = 'unassigned'
    }   
    else {
      document.getElementById('topicVAR').innerText = data[0].topic;
    }
    if (data[0].Keysup_id == null){
      document.getElementById('keySup').innerText = 'unassigned'
    }   
    else {
      document.getElementById('keySup').innerText = `${data[0].first_name} ${data[0].last_name}`;
    }
    if (data[0].sup2_id == null || data[0].sup3_id == null){
      document.getElementById('otherSups').innerText = 'not all assigned yet'
    }   
    else {
      document.getElementById('otherSups').innerText = `${data[0].sup2_id} and ${data[0].sup3_id}`;
    }
    console.log(document.getElementById('topicVAR').value); //Just to see what comes through for debugging
    console.log(document.getElementById('keySup'));
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
  fetch(`http://localhost:3000/api/users/thesStatus?stud_id=${IDnumber.stud_id}`)  //pass in student id
    .then(res => {
        if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);   //error if fetch result doesn't work
    }
    else {
    return res.json();   //if it works return json version
    }
  })
  .then(data => {    //Set the status to what the status of the thesis is, changes which popups occur
    console.log(data);
    console.log(thesStatus)
    if (data[0].status == "assigning") {
      theStatus=0;
      console.log(0);
    }
    else if (data[0].status == "active") {
      theStatus=1;
      console.log(1);
    } 
     if (data[0].status == "examining") {
      theStatus=2;
      console.log(2);
    }
    else if (data[0].status == "completed") {
      theStatus=3;
      console.log(3);
    }
  })  
  .then(() => {
    if(popVisi.classList.contains('inactive')){

        thesStatus[theStatus].classList.toggle('active');
        thesStatus[theStatus].classList.toggle('inactive');
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
    }  
})
//Add event listeners based on the status of the thesis
.then(() => {
  if (theStatus == 0) {
  SelectInstructors.addEventListener('click', () => {    // Sending entered instructors to DB so they can accept/reject
    console.log(document.getElementById('Prof2').value); //Checking they're taken in
    console.log(document.getElementById('Prof3').value);
    var prefInstructors = {                              // passing values into object for fetch request 
      prof2: document.getElementById('Prof2').value,
      prof3: document.getElementById('Prof3').value,
      stud_id: IDnumber.stud_id
    }
    console.log(prefInstructors.stud_id);

      fetch('http://localhost:3000/api/users/SubmitPrefInstructors', {  //Send saved data to backend, where it updates database
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(prefInstructors)                  //pass in string version of data from the profile details object
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
});
}
else if (theStatus == 1){
  console.log('active');
}
else if (theStatus == 2){                                  //Upload draft etc
  console.log("Wheee");
const draftUp = document.querySelector('button[name="thesDraft"]');
draftUp.addEventListener('click', () => {
  var draftDeets = {
    draft: document.getElementById('inputDraft').value,
    extraLink1: document.getElementById('Extra1').value,
    extraLink2: document.getElementById('Extra2').value,
    examDate: document.getElementById('when').value,
    examLoc: document.getElementById('where').value, 
    stud_id: IDnumber.stud_id
  }
  console.log(draftDeets);

  fetch('http://localhost:3000/api/users/upDraft', {  //Send saved data to backend, where it updates database
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(draftDeets)                  //pass in string version of data 
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
})
}
})

});





//Endpoint
});