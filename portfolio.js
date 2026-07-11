const header = document.getElementById("header");

window.addEventListener("scroll",() => {
    if(window.scrollY > 0){
        header.classList.add("header-scroll");     
    }else(
        header.classList.remove("header-scroll")
    )

})


