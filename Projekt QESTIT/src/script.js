const calendarBody = document.getElementById('calendar-body');
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();

// Funktion, um den Kalender zu generieren
function generateCalendar(currentDay) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  let row = '';
  let dayCounter = 1;

  // Berechnen Sie den Starttag des Monats
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  // Erstellen Sie eine Zeile für jede Woche
  for (let i = 0; i < 6; i++) {
    row += '<tr>';

    // Erstellen Sie eine Zelle für jeden Tag der Woche
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startDay) {
        row += '<td></td>'; // leere Zelle für Tage vor dem ersten Tag des Monats
      } else if (dayCounter <= daysInMonth) {
        if (dayCounter === currentDay) {
          row += `<td class="current-date">${dayCounter}</td>`; // heutigen Tag hervorheben
        } else {
          row += `<td>${dayCounter}</td>`;
        }
        dayCounter++;
      } else {
        row += '<td></td>'; // leere Zelle für Tage nach dem letzten Tag des Monats
      }
    }

    row += '</tr>';
  }

  calendarBody.innerHTML = row;
}

// Bestimmen Sie den aktuellen Tag extern
const currentDayOfWeek = new Date().getDay();
const currentDayOfMonth = new Date().getDate();

// Generieren Sie den Kalender mit dem aktuellen Tag
generateCalendar(currentDayOfMonth);