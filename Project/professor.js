//SET UP--------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
console.log("running");
const TopCreate = document.querySelector('button.cre');
const TopCreator = document.querySelector('.TopicCreate');
const TopViewer = document.querySelector('button.vie.th');
const TopicsMenu=document.querySelector('.TopicView');
const popVisi = document.querySelector('.popup');
const popCanc = document.querySelector('button.popbtn');
const subTopic = document.querySelector('button[name="SubTopic"]');
const viewInvs = document.querySelector('button.vie.Inv');
const pendingInvs = document.querySelector('.PendingInvites');
const Assign = document.querySelector('button.ini.ass');
const InitAssign = document.querySelector('.InitialAssign');
const ViewList = document.querySelector('button.vie.Lis');
const listViewer = document.querySelector('.ThesisList');
const ViewStats = document.querySelector('button.vie.sta');
const statisticsPanel = document.querySelector('.StatisticsPanel');
const thesisManagement = document.querySelector('#thesisManagement')
const noResult = document.querySelector('.NoResults');


console.log(localStorage.getItem('IDnumber'));

const profID = localStorage.getItem('IDnumber');


//Function when returned data has no result
function emptyResult(){
  noResult.classList.toggle('inactive');
  noResult.classList.toggle('active');
}


popCanc.addEventListener('click', () => {     //Adding X out button for each menu, which turns off all menus, stops buttons interfering with each other 
    
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
        TopCreator.classList.remove('active');
        TopCreator.classList.add('inactive');
        TopicsMenu.classList.remove('active');
        TopicsMenu.classList.add('inactive');
        pendingInvs.classList.add('inactive');
        pendingInvs.classList.remove('active');
        InitAssign.classList.add('inactive');
        InitAssign.classList.remove('active');
        listViewer.classList.add('inactive');   
        listViewer.classList.remove('active');  
        statisticsPanel.classList.add('inactive');   
        statisticsPanel.classList.remove('active');  
        noResult.classList.add('inactive');
        noResult.classList.remove('active'); 
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


//View Topic Functions-------------------------------------------------------------------------------------------------------------------------------------------------------
function createTopDiv(item, count) {
const div = document.createElement('div');
            div.className = 'box invite';
            div.setAttribute('top-id', `top${count}`);
            
            div.innerHTML = `
                <label class="invite" for="topTitle">Topic</label>
                <div class="TopicTitle">${item.topicTitle}</div>
                <button class="EDIT" id="inv${count}-accept" type="submit">Edit</button>  
            `;
            //Putting thes_id in class list so can be used in responses, there's probably a better way?
            console.log(item.stud_id, item.topic);
            return div;

}

TopViewer.addEventListener('click', () => {
   var prof_id = profID;
        pendingInvs.innerHTML = ' ';

    fetch(`http://localhost:3000/api/users/myTopics?prof_id=${prof_id}`)  //pass in professor id
    .then(res => {
        if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);   //error if fetch result doesn't work
    }
    else {
    return res.json();   //if it works return json version
    }
  })
  .then( data => {    
        console.log(data);                       
                      let count = 1;
        if (data && data.length > 0 ) {
            data.forEach(item => {
                const itemElement = createTopDiv(item, count);     //call createDiv function to create the elements
                TopicsMenu.append(itemElement);                //Add elements to the overall pending invites
                console.log("created a div"); 
                console.log(itemElement.innerHTML);    //Printing just fr debugging
                count++;
            });      
        }
        else{
          emptyResult();
        }
});
if(popVisi.classList.contains('inactive')){
    popVisi.classList.toggle('inactive');
    popVisi.classList.toggle('active');
    TopicsMenu.classList.toggle('inactive');
    TopicsMenu.classList.toggle('active');
    }

});
//View invitations functions ---------------------------------------------------------------------------------------------------------------------------------------------------

// Creates HTML elements to display all invites with accept/reject buttons, called from event listener
function createDiv(item, count) {     
const div = document.createElement('div');
            div.className = 'box invite';
            div.setAttribute('inv-id', `invite${count}`);
            
            div.innerHTML = `
                <label class="invite" for="studID">Student ID</label>
                <div name="studID" class="studentID">${item.stud_id}</div>
                <label class="invite" for="topTitle">Topic</label>
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
        else{
          emptyResult();
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
            div.className = 'box invite assignment';
            div.setAttribute('Assign-id', `assignment${count}`);
            console.log(item.topicTitle);
            div.innerHTML = `
                <label class="invite" for="studID">Student ID</label>
                <input type="text" name="studID" id="studID${count}" /> 
                <br/>
                <label class="invite" for="topTitle">Topic: </label>
                <div class="TopicTitle">${item.topicTitle}</div>
                <button class="Assign" id="Assign${count}" type="submit">Assign</button>
            `;
            return div;
}

function sendTopicSubmit(topicInfo){
  console.log("Made to function");
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
      console.log("sent assign");
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
           const AssignTop = document.querySelectorAll(`.box.invite.assignment`);
           AssignTop.forEach(item => {
            console.log(item.querySelector('.TopicTitle'));
            const AssignButton = item.querySelector('button.Assign');
            AssignButton.addEventListener('click', () => {
              var info = {
                topic: item.querySelector('.TopicTitle').innerText,
                stud_id: item.querySelector('input[name="studID"]').value,
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

//View List of theses functions --------------------------------------------------------------------------------------------------------------------------------------------

//Function for creating elements of thesis list
function createViewListDiv(item, count){
  const div = document.createElement('div');
            div.className = 'box invite';
            div.setAttribute('YourThes-id', `YourThes${count}`);
            div.classList.add(`${item.status}1`);  //Adding 1, as otherwise clash with word active
            div.classList.add(`${item.Keysup_id}`);
            console.log(item.topic);
            div.innerHTML = `
                <label class="invite" for="ThesTop">Thesis Topic:</label>
                <div class="ThesTop">${item.topic}</div> 
                <br/>
                <label class="invite" for="status">Status: </label>
                <div class="status">${item.status}</div>
                <button class="Select" id="Select${count}" type="submit">Select</button>
            `;
            return div;
}


//Function for creating the filter
function createFilter(){
  const filter = document.createElement('button');
  filter.className = 'filter';
  filter.innerHTML = "Filter by:";
  const filtersContainer = document.createElement('div');
  filtersContainer.className = 'inactive';
  filtersContainer.classList.add('filtersCont');
  filtersContainer.innerHTML = `
  <button type="submit" class="FilterBtn" id="AssigningFltr">Status: Assigning</button>
  <button type="submit" class="FilterBtn" id="ActiveFltr">Status: Active</button>
  <button type="submit" class="FilterBtn" id="GradingFltr">Status: Examining</button>
  <button type="submit" class="FilterBtn" id="CompletedFltr">Status: Completed</button>
  <button type="submit" class="FilterBtn" id="KeyFltr">Key Supervisor</button>
  <button type="submit" class="FilterBtn" id="NonKeyFltr">Committee member</button>
  <button type="submit" class="FilterBtn" id="ClearFltr">Clear Filters</button> 
  `
  listViewer.append(filter);                      //ADD filter stuff to DOM
  filter.append(filtersContainer);

  filter.addEventListener('click', () => {                   //Activate filter, need to make dropdown
    filtersContainer.classList.toggle('active');
    filtersContainer.classList.toggle('inactive');
    console.log(filtersContainer.innerHTML);
  });
  
  //Event handlers for filters
  const AssigningFilter = filtersContainer.querySelector('#AssigningFltr');  //Assigning filter
  AssigningFilter.addEventListener('click', ()=> {
    Array.from(listViewer.children).forEach(item => {
      if (!item.classList.contains('assigning1') && !item.classList.contains("filter")){
        item.classList.toggle('inactive');
      }
    })
  })
  const ActiveFilter = filtersContainer.querySelector('#ActiveFltr');    //Active filter
  ActiveFilter.addEventListener('click', ()=> {
    Array.from(listViewer.children).forEach(item => {
      if (!item.classList.contains('active1') && !item.classList.contains("filter")){
        item.classList.toggle('inactive');
      }
    })
  })
  const GradingFilter = filtersContainer.querySelector('#GradingFltr');  //Grading Filter
  GradingFilter.addEventListener('click', ()=> {
    Array.from(listViewer.children).forEach(item => {
      if (!item.classList.contains('grading1') && !item.classList.contains("filter")){
        item.classList.toggle('inactive');
      }
    })
  })
  const CompletedFilter = filtersContainer.querySelector('#CompletedFltr');  //Completed Filter
  CompletedFilter.addEventListener('click', ()=> {
    Array.from(listViewer.children).forEach(item => {
      if (!item.classList.contains('completed1') && !item.classList.contains("filter")){
        item.classList.toggle('inactive');
      }
    })
  })
  const KeyFilter = filtersContainer.querySelector('#KeyFltr');  //KeySup filter
  KeyFilter.addEventListener('click', ()=> {
    Array.from(listViewer.children).forEach(item => {
      if (!item.classList.contains(profID) && !item.classList.contains("filter")){
        item.classList.toggle('inactive');
      }
    })
  })
  const NonKeyFilter = filtersContainer.querySelector('#NonKeyFltr');  //NonKeySupFilter
  NonKeyFilter.addEventListener('click', ()=> {
    Array.from(listViewer.children).forEach(item => {
      if (item.classList.contains(profID) && !item.classList.contains("filter")){
        item.classList.toggle('inactive');
      }
    })
  })
  const ClearFilter = filtersContainer.querySelector('#ClearFltr');  //Clear filters
  ClearFilter.addEventListener('click', ()=> {
    Array.from(listViewer.children).forEach(item => {
        //item.classList.add('active');
        item.classList.remove('inactive');
    })
  })
}

ViewList.addEventListener('click', () => {
  var prof_id=profID;
  listViewer.innerHTML=" ";
  fetch(`http://localhost:3000/api/users/listView?prof_id=${prof_id}`)  //pass in professor id
    .then(res => {
        if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);   //error if fetch result doesn't work
    }
    else {
    return res.json();   //if it works return json version
    }
  })
  .then(data => {
    console.log(data);
    let count = 1;
        if (data && data.length > 0 ) {
            data.forEach(item => {
                const itemElement = createViewListDiv(item, count);     //call createDiv function to create the elements
                listViewer.append(itemElement);                        //Add elements to the overall InitAssign
                console.log("created a div"); 
                console.log(itemElement.innerHTML);                  //Printing just for debugging
                count++;
            });
             createFilter();                                      //Add filter button
           }
           else{
            emptyResult();
           }

           const selectTheses = listViewer.querySelectorAll('button.Select');
           selectTheses.forEach((button, index) => {
            button.addEventListener('click', () => {
              Array.from(listViewer.children).forEach(item => {
              //item.classList.toggle('active');
              item.classList.add('inactive');
              }) 

              const div = document.createElement('div');
              div.classList.add('box');
              div.classList.add('invite');
              div.classList.add('active');
              console.log(data[index]);
              div.innerHTML = `
              <label class="invite" for="thisTopic">Topic:</label>
              <div name="ThisTopic">${data[index].topic}</div>
              <label class="invite" for="KeyID">Key Supervisor:</label>
              <div name="ThisSupervisor">${data[index].Keysup_id}</div>
              <label class="invite" for="2ndID">Supervisor 2:</label>
              <div name="2ndSupervisor">${data[index].sup2_id}</div>
              <label class="invite" for="3rdID">Supervisor 3:</label>
              <div name="3rdSupervisor">${data[index].sup3_id}</div>
              <label class="invite" for="stud_ID">Student:</label>
              <div name="student">${data[index].stud_id}</div>
              <style> div {min-width: 60%} </style>
              `;
              console.log(data[index].topic);
              listViewer.append(div);
              console.log
            })
           })


  })



  if(popVisi.classList.contains('inactive')){
    popVisi.classList.toggle('inactive');
    popVisi.classList.toggle('active');
    listViewer.classList.toggle('inactive');
    listViewer.classList.toggle('active');
    }
});

//View Statistics functions ---------------------------------------------------------------------------------------------------------------------------------------
// Function to render charts using Chart.js
function renderChart(canvasId, label, labels, data) {
  const existingCanvas = document.getElementById(canvasId);
  if (existingCanvas) {
    existingCanvas.remove(); // remove old chart
  }
  
  const newCanvas = document.createElement('canvas');
  newCanvas.id = canvasId;
  newCanvas.width = 400;
  newCanvas.height = 300;
  statisticsPanel.appendChild(newCanvas);
  
  new Chart(newCanvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: ['#4CAF50', '#2196F3']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Function to create statistics panel content
function createStatisticsPanel() {
  statisticsPanel.innerHTML = `
    <div class="stats-header">
      <h2>Statistics Dashboard</h2>
    </div>
    <div class="charts-container">
      <div class="chart-wrapper">
        <h3>Average Completion Time</h3>
        <canvas id="avgCompletionChart"></canvas>
      </div>
      <div class="chart-wrapper">
        <h3>Average Grade</h3>
        <canvas id="avgGradeChart"></canvas>
      </div>
      <div class="chart-wrapper">
        <h3>Total Theses</h3>
        <canvas id="totalThesesChart"></canvas>
      </div>
    </div>
  `;
}

// View Statistics event listener
ViewStats?.addEventListener('click', () => {
    console.log("Loading statistics...");
    
    // Clear and setup the statistics panel
    createStatisticsPanel();
    
    // Use the same profID variable as the rest of your code
    const prof_id = profID;
    
    fetch(`http://localhost:3000/api/users/stats?prof_id=${prof_id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("Statistics data:", data);
            
            // Check if data structure matches expected format
            if (data && data.supervisor && data.committee) {
                // Render charts with the fetched data
                renderChart('avgCompletionChart', 'Avg Completion Time (days)', 
                          ['Supervisor', 'Committee'], 
                          [data.supervisor.avg_completion || 0, data.committee.avg_completion || 0]);
                
                renderChart('avgGradeChart', 'Avg Grade', 
                          ['Supervisor', 'Committee'], 
                          [data.supervisor.avg_grade || 0, data.committee.avg_grade || 0]);
                
                renderChart('totalThesesChart', 'Total Theses', 
                          ['Supervisor', 'Committee'], 
                          [data.supervisor.total || 0, data.committee.total || 0]);
            } else {
                console.error("Unexpected data structure:", data);
                emptyResult();
            }
        })
        .catch(error => {
            console.error('Error loading statistics:', error);
            emptyResult();
        });

    // Show the statistics panel using your existing popup pattern
    if(popVisi.classList.contains('inactive')){
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
        statisticsPanel.classList.toggle('inactive');
        statisticsPanel.classList.toggle('active');
    }
});


//Manage theses functions-----------------------------------------------------------------------------------------------------------------------------------
 // MANAGEMENT OF THESES
  function loadTheses() {
  const profId = profID;
  if (!profId) return alert("Missing professor ID");

  fetch(`http://localhost:3000/api/users/listView?prof_id=${profId}`)
    .then(res => {
      if (!res.ok) throw new Error("Unexpected response");
      return res.json();
    })
    .then(data => {
      console.log("Fetched theses:", data); //  Te mostrará si hay resultados
      const list = document.querySelector('.ThesisList');
      console.log(list);
      list.innerHTML = " ";

      if (data.length === 0) {
        list.innerHTML = "<li>No theses found</li>";
        return;
      }

      data.forEach(thesis => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>Topic:</strong> ${thesis.topic}<br>
          <strong>Status:</strong> ${thesis.status}<br>
          <strong>Student:</strong> ${thesis.stud_id}
        `;
        if (list) {
          list.appendChild(item);
        } else {
          console.error("❌ thesisList not found in the DOM");
}

        list.appendChild(item);
      });
    })
    .catch(err => {
      console.error("Error loading theses:", err);
      const list = document.querySelector(".ThesisList");
      list.innerHTML = "<li style='color:red;'>Error loading theses</li>";
    });
}

  document.querySelector('.man.the')?.addEventListener('click', async () => {
    if(popVisi.classList.contains('inactive')){
    popVisi.classList.toggle('inactive');
    popVisi.classList.toggle('active');
    thesisManagement.classList.toggle('inactive');
    thesisManagement.classList.toggle('active');
    }
    //const list =   document.getElementById("thesisManagement").style.display = "block";
    loadTheses();
    thesisManagement.innerHTML = '';
    //document.getElementById('invitationDetails').style.display = 'none';

    try {
      const prof_id = profID
      const res = await fetch(`http://localhost:3000/api/users/listView?prof_id=${prof_id}`);
      const data = await res.json();

      data.forEach(thesis => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${thesis.topic}</strong> (Student: ${thesis.stud_id}) - ${thesis.status}<br/>`;

        if (thesis.status === 'assigning') {
        fetch(`http://localhost:3000/api/instructor/theses/${thesis.thes_id}/invitations`)    .then(response => {
      if (!response.ok) throw new Error('Failed to load invitations');
      return response.json();
    })
    .then(data => {
      const invitationList = document.createElement('ul');
      invitationList.innerHTML = `
        <li><strong>Prof2 ID:</strong> ${data.Prof2_id} — <em>${data.Prof2Response}</em></li>
        <li><strong>Prof3 ID:</strong> ${data.Prof3_id} — <em>${data.Prof3Response}</em></li>
      `;
      thesisManagement.appendChild(invitationList);  // Añadir al contenedor de la tesis
    })
    .catch(err => {
      console.error('Error loading invitations:', err);
    });
}


  if (thesis.status === 'active' && thesis.keysup_id == prof_id) {
    const canCancel = (new Date(thesis.assignment_date) <= new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000));
    if (canCancel) {
      li.innerHTML += `
        <label>Assembly #: <input id="assemblyNum-${thesis.thes_id}" type="number"></label>
        <label>Year: <input id="assemblyYear-${thesis.thes_id}" type="number"></label>
        <button onclick="cancelAfter2Years(${thesis.thes_id})">Cancel Thesis (2+ yrs)</button>
    `;
  }
}
        if (thesis.status === 'examining') {
          li.innerHTML += `
            <a href="/uploads/${thesis.thes_id}/draft.pdf" target="_blank">View Draft</a><br>
            <button onclick="showAnnouncement(${thesis.thes_id})">View Announcement</button>
            <input type="number" id="grade-${thesis.thes_id}" min="0" max="10" placeholder="Your grade">
            <button onclick="submitGrade(${thesis.thes_id})">Submit Grade</button>
          `;
        }
        if (thesisManagement) {
          thesisManagement.appendChild(li);
        } else {
          console.error("❌ thesisList not found in the DOM");
        }
        thesisManagement.appendChild(li);
      });
    } catch (err) {
      console.error('Error loading theses:', err);
      thesisManagement.innerHTML = '<li>Error loading theses</li>';
    }
  });


  window.submitGrade = async function(thesisId) {
  const grade = document.getElementById(`grade-${thesisId}`).value;
  const prof_id = localStorage.getItem('prof_id');
  await fetch(`http://localhost:3000/api/instructor/theses/${thesisId}/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade, profId: prof_id })
  });

  alert('Grade submitted.');
}
//Endpoint
});