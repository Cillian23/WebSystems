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
console.log(localStorage.getItem('IDnumber'));

const profID = localStorage.getItem('IDnumber');



popCanc.addEventListener('click', () => {     //Adding X out button for each menu, which turns off all menus, stops buttons interfering with each other 
    
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
        TopCreator.classList.remove('active');
        TopCreator.classList.add('inactive');
        pendingInvs.classList.add('inactive');
        pendingInvs.classList.add('inactive');
     /* studentTopic.classList.remove('active');
        profile.classList.remove('active');
        thesStatus[theStatus].classList.remove('active');
        studentTopic.classList.add('inactive');
        profile.classList.add('inactive');
        thesStatus[theStatus].classList.add('inactive'); */
});


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

function createDiv(item) {     // Creates HTML elements to display all invites with accept/reject buttons
    var count = 0;
const div = document.createElement('div');
            div.className = 'box invite';
            div.setAttribute('data-id', `invite${count}`);
            
            div.innerHTML = `
                <label for="studID">Student ID</label>
                <div name="studID" class="studentID">${item.stud_id}</div>
                <label for="topTitle">Topic</label>
                <div class="TopicTitle">${item.topic}</div>
                <button type="submit">Accept</button>
                <button type="submit" class="red">Reject</button>
            `;
            count++;
            console.log(item.stud_id, item.topic);
            return div;

}

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
   /* .then(data => {
        console.log(data)     //Display data, 
    })*/
    .then( data => {    
        console.log("We're here!!");
        console.log(data);                        //for each invite, create a new html element to display it
        if (data && data.length > 0 ) {
            data.forEach(item => {
                const itemElement = createDiv(item);     //call createDiv function to create the elements
                pendingInvs.append(itemElement);
            });      
        }

    })
    .catch(error => console.error('Error:', error))


     if(popVisi.classList.contains('inactive')){
    popVisi.classList.toggle('inactive');
    popVisi.classList.toggle('active');
    pendingInvs.classList.toggle('inactive');
    pendingInvs.classList.toggle('active');
    }


})


//Endpoint
});