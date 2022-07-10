let hourRange;

const startInput = $("#startInput");
const endInput = $("#endInput");

function saveHourRange() {
  localStorage.setItem("hourRange", JSON.stringify(hourRange));
}

// When setting a new starting hour, there need to be some checks on the current end hour.
//
function setNewStartHour(startVal) {
  prevStartHour = hourRange.start;
  hourRange.start = startVal;
  if (hourRange.end <= hourRange.start) {
    hourRange.end = hourRange.start + 9;
  }
  if (hourRange.end - 14 > hourRange.start) {
    hourRange.end = hourRange.start + 9;
  }
  saveHourRange();
  setEndHourInput();
}

function setNewEndHour(endVal) {
  hourRange.end = endVal;
  saveHourRange();
}

// Will always render 12am - 11pm options. Will select the hour stored in localStorage (currently in global hourRange object)
function setStartHourInput() {
  startInput.html("");
  for (let i = 0; i < 24; i++) {
    const time = moment().startOf("day");
    const currentHour = time.add(i, "h");
    const selected = hourRange.start === i;
    startInput.append(
      `<option value="${i}" ${selected ? "selected" : ""}>${currentHour.format("ha")}</option>`
    );
  }
}

// Clear the options on change and reset them based on start time.
function setEndHourInput() {
  endInput.html("");
  endInput.append($("<option selected>Choose...</option>"));
  for (let i = hourRange.start + 1; i < hourRange.start + 15; i++) {
    const time = moment().startOf("day");
    const currentHour = time.add(i, "h");
    const selected = hourRange.end === i;
    endInput.append(
      `<option value="${i}" ${selected ? "selected" : ""}>${currentHour.format("ha")}</option>`
    );
  }
}

function setHourInputs() {
  setStartHourInput();
  setEndHourInput();
}

function getRangeFromLocal() {
  hourRange = JSON.parse(localStorage.getItem("hourRange")) || { start: 9, end: 17 };
}

function init() {
  getRangeFromLocal();
  setHourInputs();
}

init();
