/*
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    const dropZone = document.getElementById('drop_zone');
    dropZone.classList.add('dragover');
  }
  
  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.getElementById('drop_zone');
    dropZone.classList.remove('dragover');
    const files = event.dataTransfer.files;
  
    if (files.length > 0) {
      const file = files[0];
      const fileType = file.type;
  
      // Überprüfen, ob die Datei eine .xlsx-Datei ist
      if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        document.getElementById('file').files = files;
        dropZone.textContent = file.name;
  
        // Datei einlesen
        readXlsxFile(file);
      } else {
        dropZone.textContent = "Bitte eine .xlsx-Datei hochladen.";
      }
    }
  }
  
  function readXlsxFile(file) {
    const reader = new FileReader();
  
    reader.onload = function(event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Lese die erste Arbeitsmappe
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      console.log(jsonData); // Ausgabe der JSON-Daten in der Konsole
    };
  
    reader.onerror = function(event) {
      console.error("Datei konnte nicht gelesen werden: ", event.target.error);
    };
  
    reader.readAsArrayBuffer(file);
  }
  
  document.getElementById('drop_zone').addEventListener('dragleave', (event) => {
    const dropZone = document.getElementById('drop_zone');
    dropZone.classList.remove('dragover');
  });


    //ermitlung der Feiertage  
    
    async function getHolidaysForYear(year) {
      const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${2024}/DE`);
      if (!response.ok) {
          throw new Error('Netzwerkantwort war nicht ok');
      }
      const holidays = await response.json();
      return holidays;
  }
  
  function groupHolidaysByState(holidays) {
      const stateHolidays = {};
      const generalHolidays = [];
  
      holidays.forEach(holiday => {
          if (!holiday.counties) {
              // Füge den allgemeinen Feiertag zum eigenen Array hinzu
              generalHolidays.push(holiday);
          } else {
              // Füge den Feiertag zu den spezifischen Bundesländern hinzu
              holiday.counties.forEach(stateCode => {
                  if (!stateHolidays[stateCode]) {
                      stateHolidays[stateCode] = [];
                  }
                  stateHolidays[stateCode].push(holiday);
              });
          }
      });
  
      return { stateHolidays, generalHolidays };
  }
  
  getHolidaysForYear(2024)
  .then(holidays => {
    // Initialisiere das stateHolidays-Objekt mit allen Bundesländern
    const stateCodes = ["BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV", "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH"];
    const stateHolidays = {};

    // Initialisiere das stateHolidays-Objekt mit leeren Arrays
    stateCodes.forEach(stateCode => {
      stateHolidays[stateCode] = [];
    });

    // Gruppiere die Feiertage nach Bundesländern und allgemeinen Feiertagen
    const { stateHolidays: groupedStateHolidays, generalHolidays } = groupHolidaysByState(holidays);

    // Merge the generalHolidays with each state's array in groupedStateHolidays
    Object.keys(groupedStateHolidays).forEach(stateCode => {
      groupedStateHolidays[stateCode] = [...groupedStateHolidays[stateCode], ...generalHolidays];
    });

    console.log({ groupedStateHolidays, generalHolidays });
  })
  .catch(error => console.error('Fehler:', error));

  */

  const stateCodes = []; // populate with desired state codes

async function getHolidaysForYear(year) {
  const response = await fetch(`https://get.api-feiertage.de?years=${year}&states=${stateCodes.join(',')}`);
  if (!response.ok) {
    throw new Error('Netzwerkantwort war nicht ok');
  }
  const holidays = await response.json();
  return holidays;
}

function groupHolidaysByState(holidays) {
  const stateHolidays = {};
  const generalHolidays = [];

  Object.keys(holidays).forEach(year => {
    Object.keys(holidays[year]).forEach(stateCode => {
      const holiday = holidays[year][stateCode];
      if (!holiday.counties) {
        generalHolidays.push(holiday);
      } else {
        if (!stateHolidays[stateCode]) {
          stateHolidays[stateCode] = [];
        }
        stateHolidays[stateCode].push(holiday);
      }
    });
  });

  return { stateHolidays, generalHolidays };
}

getHolidaysForYear(2024)
.then(holidays => {
  const result = groupHolidaysByState(holidays);
  console.log(result);
})
.catch(error => console.error('Fehler:', error));









/*


<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bonuszahlungen</title>
  <meta name="description" content="Beschreibungstext">
  <link rel="stylesheet" href="sytle.css">
</head>

<body>

  <!-- header -->
  <header>
    Kopfbereich
  </header>

  <!-- article -->
  <article>
    <h1>Überschrift</h1>
    <p>Lorem ipsum dolor sit amet, consetetur elitr sadipscing.</p>
  </article>

  <!-- navigation -->
  <nav>
    <ul>
      <li><a href="https://qtime.qestit.com/qtime">Qtime</a></li>
    </ul>
  </nav>

  <!-- Drop down auswahl lvl -->
  <label for="lvl">Level :</label>
  <select id="lvl" name="lvl">
    <option value="de">Q1-Q3</option>
    <option value="at">Q4-Q6</option>
  </select>
  <br>

  <!-- Nummer-Eingabefeld -->
  <label for="ge">Jahreszielgehalt :</label>
  <input type="number" id="ge" name="ge" min="0" max="120000">
  <br>

  <!-- Drop down auswahl Bundesland -->
  <h1>Kalender</h1>
  <label for="state-select">Wähle ein Bundesland:</label>
  <select id="state-select">
    <option value="bw">Baden-Württemberg</option>
    <option value="by">Bayern</option>
    <option value="be">Berlin</option>
    <option value="bb">Brandenburg</option>
    <option value="hb">Bremen</option>
    <option value="hh">Hamburg</option>
    <option value="he">Hessen</option>
    <option value="mv">Mecklenburg-Vorpommern</option>
    <option value="ni">Niedersachsen</option>
    <option value="nw">Nordrhein-Westfalen</option>
    <option value="rp">Rheinland-Pfalz</option>
    <option value="sl">Saarland</option>
    <option value="sn">Sachsen</option>
    <option value="st">Sachsen-Anhalt</option>
    <option value="sh">Schleswig-Holstein</option>
    <option value="th">Thüringen</option>
  </select>
  <div id="calendar"></div>

  <!-- Drag-and-Drop Feld -->
  <label for="file">Datei hochladen:</label>
  <div id="drop_zone" class="drop-zone" ondrop="handleDrop(event)" ondragover="handleDragOver(event)">
    Datei hierher ziehen
  </div>
  <input type="file" id="file" name="file" accept=".xlsx" style="display:none;">
  <br>

  <input type="submit" value="Auswerten">

  <!-- load jsCalendar library -->
  <script src="https://cdn.jsdelivr.net/npm/jscalendar@2.2.0/dist/jsCalendar.min.js"></script>

<!-- verküpfung zu Javascript -->
<script>
  function initJsCalendar() {
    console.log(jsCalendar); // should print the jsCalendar object
    displayHolidays();

    // Create a new calendar instance
  var calendar = new jsCalendar('#calendar');
  
  // Render the calendar to the page
  calendar.render();
  }

  document.addEventListener("DOMContentLoaded", function() {
  if (typeof jsCalendar !== 'undefined') {
    initJsCalendar();
  } else {
    document.addEventListener("jscalendarLoaded", initJsCalendar);
  }
});
</script>

<!-- aside -->
<aside>
	Seitenleiste
</aside>
         
<!-- footer -->
<footer>
	Fußzeile
</footer>
    
</body>
</html> */