// Loader
document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector(".boxes").style.visibility = "visible";
    } else {
        document.querySelector(".boxes").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
};

const url = `https://brave-ray-necklace.cyclic.app/`;
const form = document.querySelector("form");
const token = localStorage.getItem("token");

// Checking if user logged in
if(!token){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Please Login First`,
        footer: '<a href="./loginPage.html">Login Now?</a>'
    });
    setTimeout(() => {
        document.location.href = "./loginPage.html";
    }, 2500)
}

let methods = {
    0:"member-based",
    1:"task-based",
    2:"project-based",
    3:"non-billable"
}
let calculationMethod = {
    0:"( member's billable rate   *   hours ) + expenses",
    1:"( task's billable rate   *   hours ) + expenses",
    2:"( billable rate   *   hours ) + expenses",
}
var method;

// Function calls
stylingOfBillableRate();


function stylingOfBillableRate() {
    let bills = document.getElementsByClassName("bill-child");
    let h4 = document.querySelectorAll(".bill-child h4");
    
    for(let i = 0; i < bills.length; i++){
    
        bills[i].addEventListener("click",()=>{
            method = i;
            for(let j = 0; j < bills.length; j++){
                bills[j].style.border = "1px solid #DFDFDF";
                h4[j].style.color = "#687481";
            }
    
            bills[i].style.border = "2px solid #3B8FC2";
            h4[i].style.color = "#3B8FC2";
            
            let formula = document.getElementById("billable-rate");
            let h5 = document.getElementById("h5");
    
            if(method < 3){
                h5.innerHTML = "Calculation rule"
                formula.innerHTML = `Billable amount = ${calculationMethod[method]}`
            } else {
                h5.innerHTML = null;
                formula.innerHTML = null;
            }
    
        })
    }
}

// Form EventListener
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(method == undefined){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Please select Billable method`
        })
        return;
    }
    let dt = new Date();

    let projectData = {
        name:form.name.value,
        description:form.comment.value,
        billMethod: methods[method],
        created:`${dt.getDate()}-${dt.getMonth()+1}-${dt.getFullYear()}`
    }
    
    fetch(`${url}project/create`,{
        method:"POST",
        headers: {
            "content-type": "application/json",
            "authorization": token
        },
        body: JSON.stringify(projectData)
    })
    .then((raw)=> raw.json()).then((original)=>{
        if(original.ok){
            Swal.fire(
                `${original.msg}`,
                '',
                'success'
            )
            
            localStorage.setItem("projectData",JSON.stringify(original.payLoad[0]));
            setTimeout(()=>{
                document.location.href = `./projectMembers.html`;
            },2500)
        }
    })
    .catch((err)=>{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong, Check console`
        })
        console.log("Error while creating project:-",err);
    });

});