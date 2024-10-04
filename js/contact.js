const url = "http://localhost:3000/contact";


document.querySelector("#contact-us-form").addEventListener('submit',(event)=>{
    
    event.preventDefault();

    let scsElem = document.querySelector("#successMessage");
    let errElem = document.querySelector("#errorMessage");

    const data={
        name:document.querySelector("#nameInput").value,
        email:document.querySelector("#emailInput").value,
        title:document.querySelector("#titleInput").value,
        text:document.querySelector("#textInput").value,
    }

    window
      .fetch(url,{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(data),})
      .then(res => res.json())
      .then(res => {
        if(res.success){

          scsElem.style.display ='block';
          errElem.style.display='none';

        }else{

          scsElem.style.display ='none';
          errElem.style.display = 'block';
          errElem.innerHTML = res.error;
        
        } 
      })

});
