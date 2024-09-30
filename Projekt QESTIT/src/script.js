const calendarBody = document.getElementById('calendar-body');
const monthYearElement = document.getElementById('monthYear');
const today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
const day = today.getDate();

/*
//block für berechnungen
let target = 0;//target hours
let holiday = 0;//Holiday Hours
let billable = 0;//Billable hours
let nonBillable = 0;//Non billable hour
let newTarget = target-holiday;//neue sollarbeitszeit
let threshold = newTarget*0.91;//schwelle
let overThreshold = newTarget-threshold;//über schwelle
let bonusHour = overThreshold*3;  //Bonus Stunden
let Illnes = 0;//Krankenstand
let travel = 0;//Reisezeit
let intern = 0;//internes Projekt
let total = 0;//total in hours
let getInput; //wert aus eingabefeld
let basicSalery = 0;//Grundgehalt (id = ge / 12) 
let saleryPerHour = salery / 174;//Stundensatz
let bonus = bonusHour * saleryPerHour; //Bonus 
let salery = basicSalery + bonus;//Gesamtgehalt
let hourWithouBonus = total - overThreshold//stunden ohne bonus


document.getElementById('ge').addEventListener('input', function() {
  getInput = document.getElementById('ge').value; //wert aus eingabefeld
  basicSalery = getInput/12;
    console.log('Monatliches Gehalt:', basicSalery);
});
*/
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

//handledrop

document.addEventListener('DOMContentLoaded', (event) => {
  const dropZone = document.getElementById('drop_zone');
  const xlsxFileInput = document.getElementById('xlsx-file');

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleDrop);

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // Zeigt an, dass ein Kopiervorgang stattfindet
  }

  function handleDrop(event) {
    event.preventDefault();
    console.log('handleDrop called');

    if (event.dataTransfer.files.length > 0) {
      xlsxFileInput.files = event.dataTransfer.files;
      console.log('xlsxFileInput:', xlsxFileInput);

      // Trigger the change event manually
      const changeEvent = new Event('change');
      xlsxFileInput.dispatchEvent(changeEvent);
    }
  }

  xlsxFileInput.addEventListener('change', (event) => {
    console.log('Change event triggered!');

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

        // Simplify the data processing
        const dataArray = data.map((row) => {
          console.log('Row:', row);
          console.log('Object.values(row):', Object.values(row));
          return Object.values(row);
        });
      }
    };

    reader.readAsArrayBuffer(file);
  });
});