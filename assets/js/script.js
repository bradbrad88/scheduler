const timeBlock = $(".time-block");
const container = $(".timeblock-container");
const startHourInput = $("#startInput");
const endHourInput = $("#endInput");
// Remove the template component from the DOM
timeBlock.detach();
let calendarContent;

// Set date in main header section
$("#currentDay").text(moment().format("dddd Do [of] MMMM, Y"));

container.on("click", "button", onSave);

// Event handlers for changing work day hours
startHourInput.on("input", onStartChange);
endHourInput.on("input", onEndChange);

function onStartChange(e) {
  const val = parseInt($(e.target).val());
  setNewStartHour(val);
  init();
}

function onEndChange(e) {
  const val = parseInt($(e.target).val());
  setNewEndHour(val);
  init();
}

function onSave(e) {
  // A reference to the jQuery textarea object is stored on the button to reliably access the correct element while delegating events
  const btn = $(e.target);
  const textArea = btn.data("textarea");
  const id = btn.data("id");
  saveContent(id, textArea.val());
}

function saveContent(key, content) {
  if (content) {
    calendarContent[key] = content;
  } else {
    // Clean empty properties to the stringified json is minimised
    delete calendarContent[key];
  }
  localStorage.setItem("calendarData", JSON.stringify(calendarContent));
}

function loadContent() {
  calendarContent = JSON.parse(localStorage.getItem("calendarData")) || {};
}

function getHourClass(selectedHour) {
  const currentHour = moment().startOf("hour");
  if (selectedHour.isBefore(currentHour)) return "past";
  if (selectedHour.isSame(currentHour)) return "present";
  return "future";
}

function buildTextArea(textArea, hour, last) {
  const hourClass = getHourClass(hour);
  textArea.addClass(hourClass);
  // set id on text area so the label 'for' property will correctly target it
  textArea.attr("id", hour.format("[input]ha"));
  textArea.text(calendarContent[hour.format("ha")]);
  // the last element to be rendered needs a border bottom
  if (last) textArea.removeClass("border-bottom-0");
  return textArea;
}

function buildLabel(label, hour) {
  label.attr("for", hour.format("[input]ha"));
  label.text(hour.format("ha"));
}

function buildButton(button, hour, textarea, last) {
  // store a reference to the text area as data on the button - a more reliable way of finding the text area related to the button
  button.data("textarea", textarea);
  button.data("id", hour.format("ha"));
  if (last) button.removeClass("border-bottom-0");
}

// throw an error to help identify errors in logic when setting start and end times
function validateParams(from, to) {
  if (!Number.isInteger(to) || !Number.isInteger(from))
    throw new Error("'TO' and 'FROM' need to be integers");
  if (to <= from) throw new Error("'TO' should be greater than 'FROM'");
}

// from and to should be integers representing 24hr time. 'to' may run over the 24hr period, for example, 26 would represent 2am the following day. Limits are handled on input event handlers.
function createTimeSlots(from, to) {
  validateParams(from, to);
  container.html("");
  for (let i = from; i <= to; i++) {
    const last = i === to;
    const template = timeBlock.clone(true, true);
    const hour = moment().startOf("day").add(i, "h");
    const textarea = buildTextArea(template.find("textarea"), hour, last);
    buildButton(template.find("button"), hour, textarea, last);
    buildLabel(template.find("label"), hour);
    container.append(template);
  }
}

function init() {
  loadContent();
  createTimeSlots(hourRange.start, hourRange.end);
}

init();
