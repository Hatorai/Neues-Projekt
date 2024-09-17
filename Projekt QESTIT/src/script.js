document.addEventListener("DOMContentLoaded", function() {
  const today = new Date();
  const day = today.getDate();
  const cells = document.querySelectorAll(".calendar td");
  cells.forEach(cell => {
      if (cell.textContent == day) {
          cell.classList.add("current-date");
      }
  });
});
  
