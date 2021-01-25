
Array.from(document.getElementsByTagName('input')).forEach(ele =>{

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

