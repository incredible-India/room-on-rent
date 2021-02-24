console.log("the rooms");
let th =document.getElementsByTagName('th');

let td =document.getElementsByTagName('td');

console.log(th);

Array.from(td).forEach(element =>{

    element.addEventListener('mousemove',(event)=>{

        event.className ="table-info"
        console.log(event);

    })
})

Array.from(th).forEach(element =>{

    element.addEventListener('mousemove',(event)=>{

        element.className ="table-warning"

    })
})