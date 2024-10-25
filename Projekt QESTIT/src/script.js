const calendarBody = document.getElementById('calendar-body');
const monthYearElement = document.getElementById('monthYear');
const today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
const day = today.getDate();

let getInput; //wert aus eingabefeld
let basicSalery = 0; //Grundgehalt (id = ge / 12)

document.getElementById('ge').addEventListener('input', function() {
  getInput = document.getElementById('ge').value; //wert aus eingabefeld
  basicSalery = getInput / 12;
  console.log('Monatliches Gehalt:', basicSalery);
});

// Funktion, um den Kalender zu generieren
function generateCalendar(currentDay) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  monthYearElement.textContent = `${getMonthName(month)} ${year}`;

  function getMonthName(month) {
    const monthName = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
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
        if (dayCounter === currentDay) {
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

// Funktion zum Steuern des Kalenders
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

// Event Listener für den Next Button
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

// handledrop
document.addEventListener('DOMContentLoaded', (event) => {
  const dropZone = document.getElementById('drop_zone');
  const xlsxFileInput = document.getElementById('xlsx-file');
  let sums = {}; // Hier wird sums definiert
  let months = []; // Hier wird months definiert

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

    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = ''; // Leere den Fehlercontainer

    // Überprüfen, ob die Datei eine .xlsx-Datei ist
    if (!file || !file.name.endsWith('.xlsx')) {
      errorContainer.textContent = 'Bitte laden Sie eine gültige .xlsx-Datei hoch.';
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      console.log('File read');

      const xlsxData = event.target.result;
      console.log('XLSX data:', xlsxData);

      const workbook = XLSX.read(xlsxData, { type: 'array' });
      console.log('Workbook:', workbook);

      sums = {}; // Initialisiere sums neu
      months = workbook.SheetNames.map(sheetName => {
        // Extrahiere den Monatsnamen aus dem Tabellennamen
        const monthMatch = sheetName.match(/([A-Za-z]+)/);
        return monthMatch ? monthMatch[0] : sheetName;
      });

      months.forEach((sheetName, monthIndex) => {
        const worksheet = workbook.Sheets[workbook.SheetNames[monthIndex]];
        console.log(`Worksheet (${sheetName}):`, worksheet);

        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log('Data:', data);

        if (!data || data.length === 0) {
          console.log(`No data in the sheet: ${sheetName}`);
        } else {
          console.log('Data length:', data.length);

          // Annahme: Die zweite Zeile enthält die Header
          const headers = data[1];
          console.log('Headers:', headers);

          // Initialisiere die Summen für jede Spalte ab der zweiten Spalte mit 0, falls noch nicht vorhanden
          headers.slice(1).forEach(header => {
            if (!sums[header]) {
              sums[header] = Array(12).fill(0); // Ein Array für jeden Monat
            }
          });

          // Durchlaufe alle Zeilen ab der vierten Zeile und summiere die Werte in den entsprechenden Spalten ab der zweiten Spalte
          for (let i = 4; i < data.length; i++) {
            const row = data[i];
            console.log('Row:', row);

            headers.slice(1).forEach((header, index) => {
              const value = row[index + 1] ? parseFloat(row[index + 1]) : 0;
              if (!isNaN(value)) {
                sums[header][monthIndex] += value;
              }
            });
          }
        }
      });

      console.log('Sums:', sums);

      // Führe die Berechnungen durch und füge die Ergebnisse hinzu
      extractAndAddData();

      // Aktualisiere die Anzeige
      updateTable();

      // Aktualisiere den Graphen
      const selectedSums = {
        'Monats basis gehalt': sums['Monats basis gehalt'],
        'Bonus höhe': sums['Bonus höhe'],
        'gesamtgehalt': sums['gesamtgehalt']
      };
      updateChart(selectedSums);
    };

    reader.readAsArrayBuffer(file);
  });

  // Funktion zum Hinzufügen neuer Spalten
  function addColumn(headerName, values) {
    if (!sums[headerName]) {
      sums[headerName] = Array(12).fill(0); // Ein Array für jeden Monat
    }
    values.forEach((value, index) => {
      if (!isNaN(parseFloat(value))) {
        sums[headerName][index] += parseFloat(value);
      }
    });
  }

  // Funktion zum Erstellen oder Aktualisieren des Graphen
  function updateChart(sums) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = months || [];
    const datasets = [
      {
        label: 'Monats basis gehalt',
        data: sums['Monats basis gehalt'] || [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Bonus höhe',
        data: sums['Bonus höhe'] || [],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      },
      {
        label: 'gesamtgehalt',
        data: sums['gesamtgehalt'] || [],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ];

    // Überprüfe die Daten und ersetze null oder undefined Werte durch 0
    datasets.forEach(dataset => {
      dataset.data = dataset.data.map(value => value !== null && value !== undefined ? value : 0);
    });

    if (window.myChart && window.myChart.data) {
      // Aktualisiere den bestehenden Graphen
      window.myChart.data.labels = labels;
      window.myChart.data.datasets = datasets;
      window.myChart.update();
    } else {
      // Erstelle einen neuen Graphen
      window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  // Funktion zum Aktualisieren der Tabelle
  function updateTable() {
    const sumsContainer = document.getElementById('sumsContainer');
    if (sumsContainer) {
      sumsContainer.innerHTML = ''; // Leere den Container

      // Erstelle eine HTML-Tabelle
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');

      // Tabellenkopf erstellen
      const headerRow = document.createElement('tr');
      const emptyHeader = document.createElement('th');
      headerRow.appendChild(emptyHeader); // Leere Zelle für die erste Spalte

      months.forEach(month => {
        const th = document.createElement('th');
        th.textContent = month;
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);

      // Tabellenkörper erstellen
      for (const [header, sumsArray] of Object.entries(sums)) {
        const row = document.createElement('tr');
        const headerCell = document.createElement('td');
        headerCell.textContent = header;
        row.appendChild(headerCell);

        sumsArray.forEach(sum => {
          const cell = document.createElement('td');
          cell.textContent = sum.toFixed(2);
          row.appendChild(cell);
        });

        tbody.appendChild(row);
      }

      table.appendChild(thead);
      table.appendChild(tbody);
      sumsContainer.appendChild(table);
    } else {
      console.error('Element mit der ID "sumsContainer" nicht gefunden');
    }
  }

  function getSelectedOptionAsBoolean() {
    const selectElement = document.getElementById('lvl');
    const selectedValue = selectElement.value;

    // Beispiel: Setze die Boolean-Variable auf true, wenn 'de' ausgewählt ist, sonst auf false
    return (selectedValue === 'de');
  }

  document.getElementById('lvl').addEventListener('change', getSelectedOptionAsBoolean);

  // Initialer Aufruf der Funktion, um den anfänglichen Zustand zu überprüfen
  let isDESelected = getSelectedOptionAsBoolean();

  // Funktion zum Extrahieren, Berechnen und Hinzufügen neuer Daten
  function extractAndAddData() {
    const targetHours = sums['Target hours'] || Array(12).fill(0);
    const totalInHours = sums['Total in hours'] || Array(12).fill(0);
    const travelTime = sums['Travel Time DE : Travel Time, non billable'] || Array(12).fill(0);
    const vacation = sums['Vacation DE : Vacation'] || Array(12).fill(0);
    const billableHours = sums['Billable hours'] || Array(12).fill(0);
    const newTargetInHours = targetHours.map((total, index) => total - vacation[index]);
    const threshold = newTargetInHours.map(target => target * 0.91);

    const overThreshold = billableHours.map((target, index) => {
      const result = target - threshold[index];
      return Math.max(result, 0); // Setzt den Wert auf 0, wenn er negativ ist
    });

    const salaryInHours = (basicSalery / 174);
    const bonusHour = overThreshold.map(target => target * 3);
    const bonusSalery = bonusHour.map(target => target * salaryInHours);

    const basicSalaryWithoutBonus = totalInHours.map((total, index) => {
      let result = total - bonusHour[index];

      // Überprüfen, ob isDESelected true ist und das Ergebnis negativ ist
      if (isDESelected) {
        result -= travelTime[index];
      }
      const calculatedSalary = result * salaryInHours;
      const minimumSalary = basicSalery * 0.91;
      return Math.max(calculatedSalary, minimumSalary);
    });

    const SaleryWithBonus = basicSalaryWithoutBonus.map((total, index) => total + bonusSalery[index]);

    // Füge die berechneten Daten wieder der Tabelle hinzu
    addColumn('Monats basis gehalt', Array(12).fill(basicSalery));
    addColumn('Stundengehalt', Array(12).fill(salaryInHours));
    addColumn('new Target in hours', newTargetInHours);
    addColumn('Grenzewert', threshold);
    addColumn('Grenzewert überschreitung', overThreshold);
    addColumn('Bonus höhe', bonusSalery);
    addColumn('Gehalt ohne Bonus', basicSalaryWithoutBonus);
    addColumn('gesamtgehalt', SaleryWithBonus);
  }
  window.exportTableToPDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    // Überprüfen, ob das Element existiert
    const tableElement = document.getElementById('sumsContainer');
  
    if (tableElement) {
      // Finde die Tabelle innerhalb des Containers
      const table = tableElement.querySelector('table');
  
      if (table) {
        // Automatische Anpassung der Spaltenbreite
        doc.autoTable({
          html: table,
          styles: {
            fontSize: 8,
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 'auto' }
          }
        });
  
        doc.save('tabelle.pdf');
      } else {
        console.error('Tabelle im sumsContainer nicht gefunden');
      }
    } else {
      console.error('Element mit der ID "sumsContainer" nicht gefunden');
    }
  };
});