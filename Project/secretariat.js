document.addEventListener('DOMContentLoaded', () => {
    const popVisi = document.querySelector('.popup');
    const popCanc = document.querySelector('button.popbtn');
    const theses = document.querySelector('button.men.viewthes');
    const theses1 = document.querySelector('.theses');
    const dataImport = document.querySelector('button.men.dimport');
    const dataImport1 = document.querySelector('.data');
    const mangThes = document.querySelector('button.men.thesmang');
    const mangThes1 = document.querySelector('.thesmanage');

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
    
});


//Secretariat page buttons ------------------------------------------------------------------------------------------------------------------------
theses.addEventListener('click', () => {
    if(popVisi.classList.contains('inactive')){
       theses1.classList.toggle('active');
       theses1.classList.toggle('inactive');
       popVisi.classList.toggle('inactive');
       popVisi.classList.toggle('active');
    }
});

dataImport.addEventListener('click', () => {
    if(popVisi.classList.contains('inactive')){
       dataImport1.classList.toggle('active');
       dataImport1.classList.toggle('inactive');
       popVisi.classList.toggle('inactive');
       popVisi.classList.toggle('active');
    }
});

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