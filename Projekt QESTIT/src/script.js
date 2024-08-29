
  const stateSelect = document.getElementById('state-select');
  const holidaysContainer = document.getElementById('holidays-container');

  stateSelect.addEventListener('change', async () => {
    const stateCode = stateSelect.value;
    if (stateCode) {
      try {
        const holidays = await getHolidaysForYear(2024, stateCode);
        const result = groupHolidaysByState(holidays);
        displayHolidays(result, holidaysContainer);
      } catch (error) {
        console.error('Fehler:', error);
      }
    }
  });

  async function getHolidaysForYear(year, stateCode) {
    const response = await fetch(`https://get.api-feiertage.de?years=${year}&states=${stateCode}`);
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

  
    if (stateHolidays) {
      Object.keys(stateHolidays).forEach(stateCode => {
        const holidays = stateHolidays[stateCode].filter(holiday => {
          return holiday.date && /^\d{4}-\d{2}-\d{2}$/.test(holiday.date);
        });
        holidays.forEach(holiday => {
          events.push({
            title: `${getStateName(stateCode)} - ${holiday.name}`,
            date: holiday.date,
          });
        });
      });
    }

    if (generalHolidays) {
      generalHolidays.forEach(holiday => {
        if (holiday.date && /^\d{4}-\d{2}-\d{2}$/.test(holiday.date)) {
          events.push({
            title: holiday.name,
            date: holiday.date,
          });
        }
      });
    }
    console.log(new Date().toLocaleDateString());
  
