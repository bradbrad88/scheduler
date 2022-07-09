const timeBlock = $(".time-block");
const container = $(".container");
timeBlock.detach();
let data;

$("#currentDay").text(moment().format("dddd Do [of] MMMM, Y"));

container.on("click", "button", onSave);

function onSave(e) {
  const btn = $(e.target);
  const textArea = btn.data("textarea");
  const id = btn.data("id");
  saveContent(id, textArea.val());
}

function saveContent(key, content) {
  if (content) {
    data[key] = content;
  } else {
    delete data[key];
  }
  localStorage.setItem("calendarData", JSON.stringify(data));
}

function loadContent() {
  data = JSON.parse(localStorage.getItem("calendarData")) || {};
}

function getHourClass(selectedHour) {
  const currentHour = moment().startOf("hour");
  if (selectedHour.isBefore(currentHour)) return "past";
  if (selectedHour.isSame(currentHour)) return "present";
  return "future";
}

function buildTextArea(textArea, hour) {
  const hourClass = getHourClass(hour);
  textArea.addClass(hourClass);
  textArea.attr("id", hour.format("[input]ha"));
  textArea.text(data[hour.format("ha")]);
  return textArea;
}

function buildLabel(label, hour) {
  label.attr("for", hour.format("[input]ha"));
  label.text(hour.format("ha"));
}

function buildButton(button, hour, textarea) {
  // store a reference to the text area as data on the button - a more reliable way of finding the text area related to the button
  button.data("textarea", textarea);
  button.data("id", hour.format("ha"));
}

function validateParams(from, to) {
  if (!Number.isInteger(to) || !Number.isInteger(from))
    throw new Error("'TO' and 'FROM' need to be integers");
  if (to <= from) throw new Error("'TO' should be greater than 'FROM'");
}

function createTimeSlots(from, to) {
  validateParams(from, to);
  for (let i = from; i <= to; i++) {
    const template = timeBlock.clone(true, true);
    const hour = moment().startOf("day").add(i, "h");
    const textarea = buildTextArea(template.find("textarea"), hour);
    buildButton(template.find("button"), hour, textarea);
    buildLabel(template.find("label"), hour);
    container.append(template);
  }
}

function init() {
  loadContent();
  createTimeSlots(9, 17);
}

init();
