function myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementsByClassName("myTable");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < table.length; i++) {
        td = table[i].getElementsByClassName("tr")[1];
        if (td) {
            txtValue = td.innerHTML;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                table[i].style.display = "";
            } else {
                table[i].style.display = "none";
            }
        }
    }
}

function myFunction2(){
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("movies");
    filter = input.value.toUpperCase();
    table = document.getElementsByClassName("myTable");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < table.length; i++) {
        td = table[i].getElementsByClassName("tr")[2];
        if (td) {
            txtValue = td.innerHTML;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                table[i].style.display = "";
            } else {
                table[i].style.display = "none";
            }
        }
    }
}