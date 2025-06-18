//SET UP--------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
console.log("running");
const TopCreate = document.querySelector('button.cre');
const TopCreator = document.querySelector('.TopicCreate');
const popVisi = document.querySelector('.popup');
const popCanc = document.querySelector('button.popbtn');
const subTopic = document.querySelector('button[name="SubTopic"]');
const viewInvs = document.querySelector('button.vie.Inv');
const pendingInvs = document.querySelector('.PendingInvites');
const Assign = document.querySelector('button.ini.ass');
const InitAssign = document.querySelector('.InitialAssign');


console.log(localStorage.getItem('IDnumber'));

const profID = localStorage.getItem('IDnumber');



popCanc.addEventListener('click', () => {     //Adding X out button for each menu, which turns off all menus, stops buttons interfering with each other 
    
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
        TopCreator.classList.remove('active');
        TopCreator.classList.add('inactive');
        pendingInvs.classList.add('inactive');
        pendingInvs.classList.remove('active');
        InitAssign.classList.add('inactive');
        InitAssign.classList.remove('active');
     /* studentTopic.classList.remove('active');  //Just a template
        profile.classList.remove('active');
        thesStatus[theStatus].classList.remove('active');
        studentTopic.classList.add('inactive');
        profile.classList.add('inactive');
        thesStatus[theStatus].classList.add('inactive'); */
});

// Button event listeners ------------------------------------------------------------------------------------------------------------------------------------------

//Create topic functions -----------------------------------------------------------------------------------------------------------------------------------------
//Activate popup
TopCreate.addEventListener('click', () => {
    document.getElementById('topTitle').value=null;  //Replace values so they're blank
    document.getElementById('topDesc').value=null;


    if(popVisi.classList.contains('inactive')){
    popVisi.classList.toggle('inactive');
    popVisi.classList.toggle('active');
    TopCreator.classList.toggle('inactive');
    TopCreator.classList.toggle('active');
    }

});
//Submitting topic button
subTopic.addEventListener('click', () => {
    var topicDeets = {
        topicTitle: document.getElementById('topTitle').value,
        topicDesc: document.getElementById('topDesc').value,
        department: localStorage.getItem('department'),
        prof_id: profID
    }
    fetch('http://localhost:3000/api/users/uploadTopic', {  
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(topicDeets)                  //pass in string version of data from the user object
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

  TopCreator.classList.toggle('active');   
  popVisi.classList.toggle('active');
  TopCreator.classList.toggle('inactive');
  popVisi.classList.toggle('inactive');

});

//View invitations functions ---------------------------------------------------------------------------------------------------------------------------------------------------

// Creates HTML elements to display all invites with accept/reject buttons, called from event listener
function createDiv(item, count) {     
const div = document.createElement('div');
            div.className = 'box invite';
            div.setAttribute('inv-id', `invite${count}`);
            
            div.innerHTML = `
                <label for="studID">Student ID</label>
                <div name="studID" class="studentID">${item.stud_id}</div>
                <label for="topTitle">Topic</label>
                <div class="TopicTitle">${item.topic}</div>
                <button class="invAccept ${item.thes_id}" id="inv${count}-accept" type="submit">Accept</button>  
                <button class="invReject ${item.thes_id} red" id="inv${count}-reject" type="submit">Reject</button>
            `;
            //Putting thes_id in class list so can be used in responses, there's probably a better way?
            console.log(item.stud_id, item.topic);
            return div;

}

//Sends response of an invite to the database
function sendResponse(InvResponse){
  console.log("Sending response");
  console.log(InvResponse.prof_id);
  fetch("http://localhost:3000/api/users/acceptORreject", {  
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(InvResponse)                  //pass in string version of data from invresponse
}) 
.then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);   //error if fetch result doesn't work
    }
    else {
      console.log("Response sent");
      return res.json();   //if it works return json version
    }
  })
  .then(data => {
    console.log(data);     //print returned data in console, just saying sql message that it's changed
  })
  .catch(err => console.error('Error:', err));
}

// Activates popup for invites, checks for invites from db, 
viewInvs.addEventListener('click', () => {
        var prof_id = profID;
        pendingInvs.innerHTML = ' ';

    fetch(`http://localhost:3000/api/users/invites?prof_id=${prof_id}`)  //pass in professor id
    .then(res => {
        if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);   //error if fetch result doesn't work
    }
    else {
    return res.json();   //if it works return json version
    }
  })

   //for each invite, create a new html element to display it
    .then( data => {    
        console.log("We're here!!");
        console.log(data);                       
                      let count = 1;
        if (data && data.length > 0 ) {
            data.forEach(item => {
                const itemElement = createDiv(item, count);     //call createDiv function to create the elements
                pendingInvs.append(itemElement);                //Add elements to the overall pending invites
                console.log("created a div"); 
                console.log(itemElement.innerHTML);    //Printing just fr debugging
                count++;
            });      
        }
        //Adding event listeners to update database
        const acceptBtns = document.querySelectorAll(`.invAccept`);   //Add event listener for each of the created buttons, accept
         console.log(acceptBtns);
         acceptBtns.forEach(button => {
          button.addEventListener('click', () => {
            console.log(button.id);
            console.log(button.classList.item(1));
            var acceptance = {   //Create object with details to accept invite
              status: "Accepted",
              thes_id: button.classList.item(1),
              prof_id: profID
            }
            sendResponse(acceptance);  //Call function to send the response
            button.classList.add("fade")
          })
         })
         const rejectBtns = document.querySelectorAll(`.invReject`);  //Add event listener for each of the created buttons, reject
         console.log(rejectBtns);
         rejectBtns.forEach(button => {
          button.addEventListener('click', () => {
            console.log(button.id);
            var rejection = {            //Create object to reject invite 
              status: "Rejected",
              thes_id: button.classList.item(1),
              prof_id: profID
            }
            sendResponse(rejection);   //Call function to send the response
            button.classList.add("fade")
          })
         })

    })
    .catch(error => console.error('Error:', error))


     if(popVisi.classList.contains('inactive')){
    popVisi.classList.toggle('inactive');
    popVisi.classList.toggle('active');
    pendingInvs.classList.toggle('inactive');
    pendingInvs.classList.toggle('active');
    }



});

// Initial Assignment functions ----------------------------------------------------------------------------------------------------------------------------------

//Create divs for topics to assign
function createAssignDiv(item, count){
  const div = document.createElement('div');
            div.className = 'box assign';
            div.setAttribute('Assign-id', `assignment${count}`);
            console.log(item.topicTitle);
            div.innerHTML = `
                <label for="studID">Student ID</label>
                <input type="text" name="studID" id="studID${count}" /> 
                <label for="topTitle">Topic: </label>
                <div class="TopicTitle">${item.topicTitle}</div>
                <button class="Assign" id="Assign${count}" type="submit">Assign</button>
            `;
            return div;
}

function sendTopicSubmit(topicInfo){
  fetch("http://localhost:3000/api/users/MakeAssign", {  
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(topicInfo)                  //pass in string version of data from the user object
}) 
    .then(res => {
        if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);   //error if fetch result doesn't work
    }
    else {
    return res.json();   //if it works return json version
    }
  })
}

Assign.addEventListener('click', () => {
        var prof_id = profID;
        InitAssign.innerHTML = ' ';

    fetch(`http://localhost:3000/api/users/ToAssign?prof_id=${prof_id}`)  //pass in professor id
    .then(res => {
        if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);   //error if fetch result doesn't work
    }
    else {
    return res.json();   //if it works return json version
    }
  })
  .then( data => {    
        console.log("We're here!!");
        console.log(data);                       
                      let count = 1;
        if (data && data.length > 0 ) {
            data.forEach(item => {
                const itemElement = createAssignDiv(item, count);     //call createDiv function to create the elements
                InitAssign.append(itemElement);                //Add elements to the overall InitAssign
                console.log("created a div"); 
                console.log(itemElement.innerHTML);    //Printing just for debugging
                count++;
            });
           }
           const AssignTop = document.querySelectorAll(`.box.assign`);
           AssignTop.forEach(item => {
            console.log(item.querySelector('.TopicTitle'));
            const AssignButton = item.querySelector('button.Assign');
            AssignButton.addEventListener('click', () => {
              var info = {
                topic: item.querySelector('.TopicTitle').innerText,
                stud_id: item.querySelector('input[name="studID"').value,
                Keysup_id: profID
              }
              sendTopicSubmit(info);
            })
           })
})

if(popVisi.classList.contains('inactive')){
    popVisi.classList.toggle('inactive');
    popVisi.classList.toggle('active');
    InitAssign.classList.toggle('inactive');
    InitAssign.classList.toggle('active');
    }
});
//Endpoint
});