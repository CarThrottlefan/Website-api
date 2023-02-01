let submitValid = false;
let data;
let names = [];
let currFilters = [];

let authUpdate, imgUpdate, altUpdate, tagUpdate, descriptUpdate, idUpdate;

async function validateSubmission(event)
{
    console.log(event.submitter.value);
    
    if(event.submitter.value == "Add")
    {
        event.preventDefault();

    form.author.style.backgroundColor = "white";
    form.image.style.backgroundColor = "white";
    form.description.style.backgroundColor = "white";
    form.tags.style.backgroundColor = "white";
    form.alt.style.backgroundColor = "white";
    
    if(form.author.value === "")
    {
        form.author.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else if(form.image.value === "")
    {
        form.image.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else if(form.description.value === "")
    {
        form.description.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else if(form.alt.value === "")
    {
        form.alt.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else if(form.tags.value === "")
    {
        form.tags.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else
    {
        submitValid = true;
    }
    
    let toSend = {
        author: form.author.value,
        image: form.image.value,
        alt: form.alt.value,
        description: form.description.value,
        tags: form.tags.value
    };
    
    let jsonString = JSON.stringify(toSend);
    console.log(jsonString);
   
    await fetch('http://localhost:3000/currDb/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: jsonString,
})
  .then((response) => response.json())
  .then((toSend) => {
    console.log('Success:', toSend);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

}

else //for the Update functionality
{
    event.preventDefault();

    form.author.style.backgroundColor = "white";
    form.image.style.backgroundColor = "white";
    form.description.style.backgroundColor = "white";
    form.tags.style.backgroundColor = "white";
    form.alt.style.backgroundColor = "white";

    console.log( authUpdate )
    
    if(form.author.value === "")
    {
        form.author.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else if(form.image.value === "")
    {
        form.image.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else if(form.description.value === "")
    {
        form.description.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else if(form.alt.value === "")
    {
        form.alt.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else if(form.tags.value === "")
    {
        form.tags.style.backgroundColor = "#e63d3d";
        submitValid = false;
    }
    else
    {
        submitValid = true;
    }
    
    let toSend = {
        author: form.author.value,
        image: form.image.value,
        alt: form.alt.value,
        description: form.description.value,
        tags: form.tags.value
    };
    
    let jsonString = JSON.stringify(toSend);
    console.log(jsonString);
   
    await fetch('http://localhost:3000/currDb/item/' + idUpdate, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: jsonString,
})
}
  if(submitValid)
  {
    console.log('valid');
    refreshGallery();
    getDatabase();
    names=[];
    updateList();
  }
}

let form = document.getElementById("submitForm");
    form.addEventListener("submit", validateSubmission);

async function getDatabase()
{
    try{
        let response = await fetch('http://localhost:3000/currDb/');
        data = await response.json();
    }
    
    catch(error){
        console.log(error);
    }
    displayDatabase();
}

function displayDatabase()
{
    
    let lastPerson = data.length;
    for(let person = 0; person < lastPerson; person++)
    {
        authorDisplay(person);
        makeList(person);
        getFilters();
    }
}

function authorDisplay(x) //gets all the elements of the submission for an author, combines them and then adds them to the DOM
{
    let skeleton = document.createElement('div');
    skeleton.setAttribute('data-item', data[x].author);
    skeleton.classList.add('item');
    skeleton.setAttribute('id', data[x].id);
    skeleton.setAttribute('num', x);

        let imgSkeleton = document.createElement('div');
        imgSkeleton.classList.add('cell');
        imgSkeleton.addEventListener("click",event => { console.log( data[x] )
        idUpdate = data[x].id; authUpdate = data[x].author; imgUpdate = data[x].image; descriptUpdate = data[x].description; tagUpdate = data[x].tags; altUpdate = data[x].alt 
        form.author.value = authUpdate;
        form.image.value = imgUpdate;
        form.description.value = descriptUpdate;
        form.alt.value = altUpdate;
        form.tags.value = tagUpdate;
    });

        let imgWrapSkeleton = document.createElement('div');
        imgWrapSkeleton.classList.add('img-wrap');

        let img = document.createElement('img');
        img.classList.add('album-image');
        img.src = data[x].image;

        let imgDescript = document.createElement('div');
        imgDescript.classList.add('img-description-layer');

        let author = document.createElement('p');
        author.classList.add('author-name');
        let authorTxt = document.createTextNode(data[x].author);
        author.appendChild(authorTxt);
                    
        let alt = document.createElement('p');
        alt.classList.add('author-alt');
        let altTxt = document.createTextNode(data[x].alt);
        alt.appendChild(altTxt);

        let tags = document.createElement('p');
        tags.classList.add('img-tags');
        let tagsTxt = document.createTextNode(data[x].tags);
        tags.appendChild(tagsTxt);

        imgDescript.appendChild(author);
        imgDescript.appendChild(alt);
        imgDescript.appendChild(tags);
                
        imgWrapSkeleton.appendChild(img);
        imgWrapSkeleton.appendChild(imgDescript);

        imgSkeleton.appendChild(imgWrapSkeleton);
        skeleton.appendChild(imgSkeleton);
//-----------------------------------------------------       
    let descriptSkeleton = document.createElement('div');
    descriptSkeleton.classList.add('cell');
        
        let descript = document.createElement('p');
        let descriptTxt = document.createTextNode(data[x].description);
        descript.appendChild(descriptTxt);

    descriptSkeleton.appendChild(descript);
    skeleton.appendChild(descriptSkeleton);
//-----------------------------------------------------
    let connect = document.querySelector('.table-body');
    connect.appendChild(skeleton);
}

function refreshGallery()
{
    let toRemove = document.getElementById('authorsAlbum');
    toRemove.remove();

    let newDiv = document.createElement('div');
    newDiv.classList.add('table-body');
    newDiv.setAttribute('id', 'authorsAlbum');
    let connect = document.getElementById('album');
    connect.appendChild(newDiv);
}

getDatabase();

async function resetDatabase(event)
{
  let url = 'http://localhost:3000/currDb/';
  let response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if(response.ok)
  {
    console.log('Reseted database');
    names=[];
    refreshGallery();
    getDatabase();
    updateList();
  }
  else
  {
    console.log(response.status);
  }
}

let resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", resetDatabase);
    
//-------------------Hamburger Menu starts here-----------------
const menu = document.querySelector(".menu");
const hamburger= document.querySelector(".hamburger");
const closeIcon= document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    closeIcon.style.display = "none";
    menuIcon.style.display = "block";
  } else {
    menu.classList.add("showMenu");
    closeIcon.style.display = "block";
    menuIcon.style.display = "none";
  }
}

hamburger.addEventListener("click", toggleMenu);
closeIcon.style.display = "none";
//-----------------Hamburger Menu ends here--------------------

//----------------Submit Modal starts here-----------------
const modalAuth = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

// close modal function
const closeModal = function () {
  modalAuth.classList.add("hidden");
  overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// open modal function
const openModal = function () {
  modalAuth.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
// open modal event
openModalBtn.addEventListener("click", openModal);
//modal ends here
//--------------Submit Modal ends here-------------------

//------------------List starts here-----------------------
function makeList(x) //gets all the elements of the submission for an author, combines them and then adds them to the DOM
{
    if(!names.includes(data[x].author))
    {
        names.push(data[x].author);

        let skeleton = document.createElement('li');
        skeleton.setAttribute('data-filter', data[x].author);
        skeleton.classList.add('checkbox');
        
        let input = document.createElement('input');
        let inputNum = 'f' + x;
        input.setAttribute('id', inputNum);
        input.setAttribute('type', 'checkbox');
        
        let label = document.createElement('label');
        label.setAttribute('for', inputNum);
        let labelTxt = document.createTextNode(data[x].author);
        label.appendChild(labelTxt);

        skeleton.appendChild(input);
        skeleton.appendChild(label);
        let connect = document.querySelector('.filter-list');
        connect.appendChild(skeleton);
    }
}

function updateList() 
{
    let toRemove = document.querySelector('.filter-list');
    toRemove.remove();

    let newUl = document.createElement('ul');
    newUl.classList.add('filter-list');
    let connect = document.getElementById('filter-container');
    connect.appendChild(newUl);
}
//------------------List ends here------------------

//------------------Filter gallery------------------
function getFilters()
{
    let list = document.querySelectorAll('.checkbox');
    
    for(let i = 0; i < list.length; i++){
        list[i].addEventListener('change', function(){
            currFilters.push(list[i].getAttribute('data-filter'));
            activeFilter();
        })
    }

    let button = document.getElementById('filter-button');
    button.addEventListener('click', deactivateFilter);
}

function activeFilter()
{
    let lastPerson = data.length;
    refreshGallery();
    for(let person = 0; person < lastPerson; person++)
    {
        if(currFilters.includes(data[person].author))
        {
            authorDisplay(person);
            makeList(person);
        }
    }
}

function deactivateFilter()
{
    refreshGallery();
    getDatabase();
    currFilters = [];
    names = [];
    updateList();
}