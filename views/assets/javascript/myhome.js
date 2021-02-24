console.log("the rooms");
let th =document.getElementsByTagName('th');

let td =document.getElementsByTagName('td');



Array.from(td).forEach(element =>{//this generate hover effect and change the color of table data

    element.addEventListener('mouseleave',(event)=>{

        element.className ="table-dark"


    })
})

Array.from(th).forEach(element =>{  //this generate hover effect and change the color of table heading

    element.addEventListener('mouseleave',(event)=>{

        element.className ="table-dark"

    })
})


Array.from(td).forEach(element =>{//this generate hover effect and change the color of table data

    element.addEventListener('mouseover',(event)=>{
      
        element.className ="table-info"

    })
})



Array.from(th).forEach(element =>{ //this generate hover effect and change the color of table data

    element.addEventListener('mouseover',(event)=>{
   
        element.className ="table-success"

    })
})

// Array.from(th).forEach(element =>{//this generate hover effect and change the color of table heading

//     element.addEventListener('mouseout',(event)=>{

//         element.className ="table-success"

//     })
// })