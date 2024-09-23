const calendarBody = document.getElementById('calendar-body');
const monthYearElement = document.getElementById('monthYear');
const today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
const day = today.getDate();

// Funktion, um den Kalender zu generieren
function generateCalendar(currentDay) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  monthYearElement.textContent = `${getMonthName(month)} ${year}`;
  
  function getMonthName(month) {
    const monthName = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember'
    ];
    return monthName[month];
  }

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
        if (dayCounter === currentDay ) {
          row += `<td>${dayCounter}</td>`; // heutigen Tag hervorheben
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

// Generieren Sie den Kalender
generateCalendar(currentDayOfMonth);

//Funktion zum steuern des Kalenders
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

prevButton.addEventListener('click', () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  generateCalendar(1); // Generate calendar for the first day of the month
});

// Event Listener für den  next Button
nextButton.addEventListener('click', () => {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    generateCalendar(1); // Kalender für den ersten Tag des Monats generieren
});

// Initialer Aufruf zur Generierung des Kalenders
generateCalendar(1);

function handleDragOver(event) {
  event.preventDefault();
}
function handleDrop(event) {
  event.preventDefault();
  console.log('handleDrop called');

  const xlsxFileInput = document.getElementById('xlsx-file');
  const xlsxDataSelect = document.getElementById('xlsx-data');

  xlsxFileInput.addEventListener('change', (event) => {
    console.log('File changed');

    const file = event.target.files[0];
    console.log('File:', file);

    const reader = new FileReader();

    reader.onload = (event) => {
      console.log('File read');

      const xlsxData = event.target.result;
      console.log('XLSX data:', xlsxData);

      const workbook = XLSX.read(xlsxData, { type: 'array' });
      console.log('Workbook:', workbook);

      const sheetName = workbook.SheetNames[0];
      console.log('Sheet name:', sheetName);

      const worksheet = workbook.Sheets[sheetName];
      console.log('Worksheet:', worksheet);

      const data = XLSX.utils.sheet_to_json(worksheet);
      console.log('Data:', data);

      if (!data || data.length === 0) {
        console.log('No data in the XLSX file');
      } else {
        console.log('Data length:', data.length);

        // Store the data in an array
        const dataArray = [];
        data.forEach((row) => {
          console.log('Row:', row);
          dataArray.push(Object.values(row));
        });

        // Output the dataArray to the console
        console.log('dataArray:', dataArray);
      }
    };

    reader.readAsArrayBuffer(file);
  });
}