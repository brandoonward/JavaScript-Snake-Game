document.addEventListener('DOMContentLoaded', function() {
    // pTag = document.querySelector("div");
    // newVal = document.createElement("p");
    // newVal.innerHTML = '';
    // pTag.appendChild(newVal);
    
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
    document.getElementById('retryButton').addEventListener("click", function() {
          setupGame();
          
          document.getElementById('deadNotif').innerHTML = '';
          document.getElementById('deadNotif').style.border = "";
        });
  });