let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('familyEvents')) || {};

// 2026년 한국 공휴일 (임시 목록)
const holidays = {
    '2026-01-01': '신정',
    '2026-02-16': '설날 연휴',
    '2026-02-17': '설날',
    '2026-02-18': '설날 연휴',
    '2026-03-01': '삼일절',
    '2026-03-02': '대체공휴일',
    '2026-05-05': '어린이날',
    '2026-05-24': '부처님 오신 날',
    '2026-05-25': '대체공휴일',
    '2026-06-06': '현충일',
    '2026-08-15': '광복절',
    '2026-08-17': '대체공휴일',
    '2026-09-24': '추석 연휴',
    '2026-09-25': '추석',
    '2026-09-26': '추석 연휴',
    '2026-10-03': '개천절',
    '2026-10-05': '대체공휴일',
    '2026-10-09': '한글날',
    '2026-12-25': '성탄절'
};

const monthDisplay = document.getElementById('month-display');
const calendarGrid = document.getElementById('calendar-grid');
const modal = document.getElementById('event-modal');
const closeBtn = document.querySelector('.close');
const eventForm = document.getElementById('event-form');
const eventDateInput = document.getElementById('event-date');
const modalDateDisplay = document.getElementById('modal-date-display');
const eventList = document.getElementById('event-list');

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthDisplay.innerText = `${year}년 ${month + 1}월`;

    // 헤더(요일)를 제외하고 모두 비우기
    const dayHeaders = document.querySelectorAll('.day-header');
    calendarGrid.innerHTML = '';
    dayHeaders.forEach(header => calendarGrid.appendChild(header));

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    // 이전 달 날짜 채우기
    for (let i = firstDay; i > 0; i--) {
        createDayCell(year, month - 1, prevLastDate - i + 1, true);
    }

    // 이번 달 날짜 채우기
    for (let i = 1; i <= lastDate; i++) {
        createDayCell(year, month, i, false);
    }

    // 다음 달 날짜 채우기
    const remainingSlots = 42 - (firstDay + lastDate); // 6줄(42칸) 기준
    for (let i = 1; i <= remainingSlots; i++) {
        createDayCell(year, month + 1, i, true);
    }
}

function createDayCell(year, month, day, isOtherMonth) {
    const dateObj = new Date(year, month, day);
    const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const dayOfWeek = dateObj.getDay(); // 0: 일요일, 6: 토요일
    
    const cell = document.createElement('div');
    cell.className = 'day-cell' + (isOtherMonth ? ' other-month' : '');
    
    // 주말 및 공휴일 클래스 추가
    if (dayOfWeek === 0) cell.classList.add('sunday');
    if (dayOfWeek === 6) cell.classList.add('saturday');
    if (holidays[dateKey]) cell.classList.add('holiday');

    const today = new Date();
    if (dateObj.toDateString() === today.toDateString()) {
        cell.classList.add('today');
    }

    let innerHTML = `<div class="date-num">${day}</div>`;
    if (holidays[dateKey]) {
        innerHTML += `<div class="holiday-name" style="font-size: 0.6rem; color: #dc3545; margin-bottom: 2px;">${holidays[dateKey]}</div>`;
    }
    cell.innerHTML = innerHTML;
    
    // 이벤트 렌더링
    if (events[dateKey]) {
        events[dateKey].forEach((event, index) => {
            const eventEl = document.createElement('div');
            eventEl.className = `event-item event-${event.member}`;
            eventEl.innerText = event.title;
            cell.appendChild(eventEl);
        });
    }

    cell.onclick = () => openModal(dateKey);
    calendarGrid.appendChild(cell);
}

function openModal(dateKey) {
    eventDateInput.value = dateKey;
    modalDateDisplay.innerText = `${dateKey} 일정`;
    renderEventList(dateKey);
    modal.style.display = 'block';
}

function renderEventList(dateKey) {
    eventList.innerHTML = '';
    if (events[dateKey]) {
        events[dateKey].forEach((event, index) => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <span>[${getMemberName(event.member)}] ${event.title}</span>
                <button class="delete-btn" onclick="deleteEvent('${dateKey}', ${index})">삭제</button>
            `;
            eventList.appendChild(div);
        });
    }
}

function getMemberName(member) {
    const names = { common: '공통', father: '아빠', mother: '엄마', son: '아들', daughter: '딸' };
    return names[member] || '';
}

window.deleteEvent = (dateKey, index) => {
    events[dateKey].splice(index, 1);
    if (events[dateKey].length === 0) delete events[dateKey];
    saveAndRefresh();
    renderEventList(dateKey);
};

function saveAndRefresh() {
    localStorage.setItem('familyEvents', JSON.stringify(events));
    renderCalendar();
}

eventForm.onsubmit = (e) => {
    e.preventDefault();
    const dateKey = eventDateInput.value;
    const title = document.getElementById('event-title').value;
    const member = document.getElementById('event-member').value;

    if (!events[dateKey]) events[dateKey] = [];
    events[dateKey].push({ title, member });
    
    saveAndRefresh();
    eventForm.reset();
    modal.style.display = 'none';
};

document.getElementById('prev-month').onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById('next-month').onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

document.getElementById('today-btn').onclick = () => {
    currentDate = new Date();
    renderCalendar();
};

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

renderCalendar();
