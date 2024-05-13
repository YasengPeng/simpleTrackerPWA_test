const form = document.querySelector('form');
const startInput = document.getElementById('start-date');
const endInput = document.getElementById('end-date');
const pastPeriods = document.querySelector('.pastPeriods');

const STORAGE_KEY = 'periods';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  storeNewPeriod(
    startInput.value,
    endInput.value
  );

  loadPeriods();

  form.reset();
})

function getPeriods() {
  const periods = window.localStorage.getItem(STORAGE_KEY);
  if (periods === null) {
    return [];
  }

  return JSON.parse(periods);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function storeNewPeriod(startDate, endDate) {
  const periods = getPeriods();

  periods.push({ startDate, endDate });

  periods.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
}

function removePeriod(index) {
  const periods = getPeriods();
  periods.splice(index, 1);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
}

function onRemovePeriod(index) {
  removePeriod(index);
  loadPeriods();
}

function loadPeriods() {
  const periods = getPeriods();

  pastPeriods.innerHTML = '';
  
  if (periods.length === 0) return;

  const header = document.createElement('h2');
  header.textContent = 'Past periods';

  const list = document.createElement('ul');

  periods.forEach((period, index) => {
    const periodElement = document.createElement('li');
    periodElement.textContent = `From ${formatDate(period.startDate)} to ${formatDate(period.endDate)} `;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => onRemovePeriod(index));
    periodElement.appendChild(removeButton);
    list.appendChild(periodElement);
  });

  pastPeriods.appendChild(header);
  pastPeriods.appendChild(list);
}

loadPeriods();

/*const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        'sw.js',
        {
          scope: './',
        }
      );
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();*/

function showNotification() {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        setTimeout(() => {
          registration.showNotification("Vibration Sample", {
            body: "Buzz! Buzz!",
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: "vibration-sample",
          });
        }, 3000);
      });
    }
  });
}

const notifyButton = document.getElementById('notify');
notifyButton.addEventListener('click', () => showNotification());