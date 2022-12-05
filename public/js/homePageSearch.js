function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByClassName("card");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("h3")[0];
        txtValue = td.innerText;
        if (td) {
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

const movieIndustry = document.getElementById("movieIndustry");
const movieGenre = document.getElementById("movieGenre");

movieIndustry.addEventListener("change", () => {
    location.href = `/user/homePageByMI/?movieIndustry=${movieIndustry.value}`;
})

movieGenre.addEventListener("change", () => {
    location.href = `/user/homePageByMG/?movieGenre=${movieGenre.value}`;
})