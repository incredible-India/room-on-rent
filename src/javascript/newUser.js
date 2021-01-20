// let fname =document.getElementsByClassName('fname')[0];
// let lname =document.getElementsByClassName('lname')[0];
// let email =document.getElementsByClassName('email')[0];
let mobile =document.getElementsByClassName('mobile')[0];
let pass =document.getElementsByClassName('pass')[0];
let cnfpass =document.getElementsByClassName('cnfpass')[0];
// let city =document.getElementsByClassName('city')[0];
let zip =document.getElementsByClassName('zip')[0];
let agree =document.getElementsByClassName('agree')[0];
let SubmitBtn =document.getElementById('submit');

// now we will check the form validation 

function validateForm(){
  
    
    SubmitBtn.pre

    Array.from(document.getElementsByTagName('input')).forEach(element=>{ //cheking input box is blank or not

      

        if(element.value == "" && element.type != "file" && element.type != "checkbox")
        {
          element.style.borderColor ="red";
          return false;
        }
        else
        {
            if(pass.value != cnfpass.value)
            {
                document.getElementsByClassName('alert-danger')[0].innerHTML = "Pasword Does Not Matched !";
                document.getElementsByClassName('alert-danger')[0].style.display="block";
                return  false;
         
            }else if( pass.value.length <= 4)
            {
         
             document.getElementsByClassName('alert-danger')[0].innerHTML = "Password is too small";
             document.getElementsByClassName('alert-danger')[0].style.display="block";
             return  false;
         
            }else if(agree.checked == false)
            {
             document.getElementsByClassName('alert-danger')[0].innerHTML = "Agree the terms and Conditions";
             document.getElementsByClassName('alert-danger')[0].style.display="block";
             return  false;
            }else if(mobile.value.length < 10){
         
             document.getElementsByClassName('alert-danger')[0].innerHTML = "invalid mobile number";
             document.getElementsByClassName('alert-danger')[0].style.display="block";
             return  false;
         
         
            }else
            {
               return true;
            }
         
        }

     



    })


   

}

Array.from(document.getElementsByTagName('input')).forEach(element=>{


element.addEventListener('click',()=>{

    element.style.borderColor ="black";
    document.getElementsByClassName('alert-danger')[0].style.display ="none";//hide the alert box after click on any input box
})


})



