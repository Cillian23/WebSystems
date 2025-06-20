document.addEventListener('DOMContentLoaded', () => {
    const popVisi = document.querySelector('.popup');
    const popCanc = document.querySelector('button.popbtn');
    const theses = document.querySelector('button.men.viewthes');
    const theses1 = document.querySelector('.theses');
    const dataImport = document.querySelector('button.men.dimport');
    const dataImport1 = document.querySelector('.data');
    const mangThes = document.querySelector('button.men.thesmang');
    const mangThes1 = document.querySelector('.thesmanage');
    const DataImportSubmit = document.querySelector('button[name="GetData"]');


/*fetch('http://localhost:3000/api/users')
  .then(res => res.json())
  .then(data => {
    console.log(data); // handle it in DOM
  })
  .catch(err => console.error(err));
  */

//Add event listeners for Secretariat page, only work if popup menu is currently inactive----------------------------------------------------------------------

    popCanc.addEventListener('click', () => {     //Adding X out button for each menu, which turns off all menus, stops buttons interfering with each other 
        popVisi.classList.toggle('inactive');
        popVisi.classList.toggle('active');
        theses1.classList.remove('active');
        dataImport1.classList.remove('active');
        mangThes1.classList.remove('active');
        theses1.classList.add('inactive');
        dataImport1.classList.add('inactive');
        mangThes1.classList.add('inactive');
        const existingDownload = dataImport1.querySelector('.DownloadLink');
        if (existingDownload) {
            existingDownload.remove();
        }
    
});


//Secretariat page buttons ------------------------------------------------------------------------------------------------------------------------
function createThesesDiv(item, count){
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

theses.addEventListener('click', () => {
  theses1.innerHTML=" ";
  fetch(`http://localhost:3000/api/users/listViewSec`)  //pass in professor id
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
                const itemElement = createThesesDiv(item, count);     //call createDiv function to create the elements
                theses1.append(itemElement);                        //Add elements to the overall InitAssign
                console.log("created a div"); 
                console.log(itemElement.innerHTML);                  //Printing just for debugging
                count++;
            });                                     
           }

           const selectTheses = theses1.querySelectorAll('button.Select');
           selectTheses.forEach((button, index) => {
            button.addEventListener('click', () => {
              Array.from(theses1.children).forEach(item => {
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
              theses1.append(div);
              console.log
            })
           })


  })
    if(popVisi.classList.contains('inactive')){
       theses1.classList.toggle('active');
       theses1.classList.toggle('inactive');
       popVisi.classList.toggle('inactive');
       popVisi.classList.toggle('active');
    }
});

dataImport.addEventListener('click', () => {
    document.getElementById('sn').value=" ";     //Set value to blank
    console.log(document.getElementById('sn').value);

    if(popVisi.classList.contains('inactive')){
       dataImport1.classList.toggle('active');
       dataImport1.classList.toggle('inactive');
       popVisi.classList.toggle('inactive');
       popVisi.classList.toggle('active');
    }
});

DataImportSubmit.addEventListener('click', () => {
    var Queryid = document.getElementById('sn').value;
    console.log(Queryid);
    div = document.createElement('div');
    div.className="DownloadLink";
    div.innerHTML = `<a href="http://localhost:3000/api/users/DataImport?Query_id=${Queryid}" download="users.json">Download UserData JSON</a>`;
    dataImport1.append(div);

})

mangThes.addEventListener('click', () => {
    if(popVisi.classList.contains('inactive')){
       mangThes1.classList.toggle('active');
       mangThes1.classList.toggle('inactive');
       popVisi.classList.toggle('inactive');
       popVisi.classList.toggle('active');
    }
});




    // Endpoint
});