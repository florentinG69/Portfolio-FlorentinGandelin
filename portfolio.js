const header = document.getElementById("header");

window.addEventListener("scroll",() => {
    if(window.scrollY > 0){
        header.classList.add("header-scroll");     
    }else(
        header.classList.remove("header-scroll")
    )

})

// Ajustement du padding-top désactivé — on affiche le hero derrière le header
// Si tu veux réactiver l'ajustement automatique du padding, décommente la fonction ci-dessous.
/*
function adjustMainPadding(){
    const hdr = document.getElementById('header');
    const main = document.querySelector('main');
    if(!hdr || !main) return;
    main.style.paddingTop = hdr.offsetHeight + 'px';
}

window.addEventListener('load', adjustMainPadding);
window.addEventListener('resize', adjustMainPadding);
adjustMainPadding();
*/


