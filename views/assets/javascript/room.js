
let statename = ["Andhra Pradesh","Andaman and Nicobar Islands","Arunachal Pradesh",
,"Assam","Bihar","Chandigarh","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand"
,"Karnataka","Kerala","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur",
,"Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim"
,"Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"] //all the indian state name

let datalist = document.getElementById('datalistOptions'); //this is the datalist 

for (i in statename)
{
    datalist.innerHTML +=`
    <option value='${statename[i]}'> ${statename[i]} </option>
    `

} //inside the datalist tag we will insert




Array.from(document.getElementsByTagName('input')).forEach(ele =>{ //IT WILL GIVE THE WARNING TO THE USER IF INPUT FIELD WILL BE BLANK

        ele.addEventListener('focusout',()=>{
            if(ele.value == "")
            {
                ele.className = "form-control is-invalid"
            }else
            {
                ele.className = "form-control is-valid"

            }
        })

})

Array.from(document.getElementsByTagName('textarea')).forEach(ele =>{ //IT WILL GIVE THE WARNING TO THE USER IF Textarea FIELD WILL BE BLANK

    ele.addEventListener('focusout',()=>{
        if(ele.value == "" && ele.type != 'checkbox')
        {
            ele.className = "form-control is-invalid"
        }else
        {
            ele.className = "form-control is-valid"

        }
    })

})


//this function will check the validation 
function checkValidation() {

    
let mobile = document.getElementById('mobile'); //mobile number 
let altmobile =document.getElementById('altmobile'); // alternate mobile number
let monthlyRate = document.getElementById('monthlyrent'); //monthly rate
let dwnpayment = document.getElementById('downpayment');//down payment

if(mobile.value.length < 10 || altmobile.value.length < 10  ) //MOBILE NUMBER VALIDATON
{
    alert("Please enter the correct mobile number")
    return false ;

}else if(monthlyRate.value <= 0 || dwnpayment.value <=0)//PAYMENT OPTION VALIDATION
{
    alert("Please correct the payment options");
    return false ;
}
else
{
    return true;
}


}

let zip = document.getElementById('zip');//tells the zip code input tag
let city = document.getElementById('city');//tells the city input tag
let villege =document.getElementById('village');
let states =document.getElementsByClassName('states')[0];
let address =document.getElementById('address');

if(navigator.onLine)//first we will check user is online or not
{
    zip.addEventListener('focusout',(event)=>{
        if(zip.value == "")
        {
            return ;
        }else
        {
            try {
                
                fetch(`https://api.postalpincode.in/pincode/${zip.value}`)
                .then(data =>{
                    return data.json()
                }).then (finaldata =>{

                    console.log(finaldata);

                    states.value = finaldata[0].PostOffice[0].State
                    villege.value = finaldata[0].PostOffice[0].Name
                    city.value = finaldata[0].PostOffice[0].District
                    address.value = finaldata[0].PostOffice[0].Name +" " +finaldata[0].PostOffice[0].District + " " + zip.value +" " +finaldata[0].PostOffice[0].State 



                }).catch(error=>{
                    alert("incorrect zip")
                })

            } catch (error) {
                console.log(error);
            }
        }
    })
}