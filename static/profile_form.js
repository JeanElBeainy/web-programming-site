const profileForm = document.getElementById("profileForm");
const reviewPanel = document.getElementById("reviewPanel");
const reviewList = document.getElementById("reviewList");

function fieldValue(id) {
  return document.getElementById(id).value;
}

function listText(values) {
  return values.join(", ") || "None";
}

function collectAnswers() {
  const graduation = document.querySelector('input[name="graduation"]:checked').value;
  const internship = document.querySelector('input[name="internship_completed"]:checked').value;

  const skills = [...document.querySelectorAll('input[name="skills"]:checked')]
    .map(box => box.value);
  const software = [...document.getElementById("software").selectedOptions]
    .map(option => option.value);

  return {
    "Student ID": fieldValue("student_id"),
    "Full name": fieldValue("fullname"),
    "USEK email": fieldValue("email"),
    "Mobile number": fieldValue("phone"),
    "Date of birth": fieldValue("birthdate"),
    "GitHub": fieldValue("portfolio"),
    "GIN446 website": fieldValue("gin446"),
    "Major": fieldValue("major"),
    "GPA / 100": fieldValue("gpa"),
    "Credits completed": fieldValue("credits"),
    "Expected graduation": graduation,
    "Graduation month": fieldValue("graduation_month"),
    "Internship completed": internship,
    "Areas of experience": listText(skills),
    "Primary language": fieldValue("language"),
    "Engineering software": listText(software),
    "Project title": fieldValue("project_title"),
    "Project area": fieldValue("project_area"),
    "Brief description": fieldValue("description"),
    "Team size": fieldValue("team_size"),
    "Dashboard colour": fieldValue("project_color"),
    "Meeting date": fieldValue("meeting_date"),
    "Meeting time": fieldValue("meeting_time"),
  };
}

function showReview() {
  reviewList.textContent = "";
  const answers = collectAnswers();

  for (let i in answers) {
    const row = document.createElement("p");
    row.textContent = i + ": " + answers[i];
    reviewList.appendChild(row);
  }

  profileForm.classList.add("hidden");
  reviewPanel.classList.add("open");
}

function editForm() {
  reviewPanel.classList.remove("open");
  profileForm.classList.remove("hidden");
}

function confirmSubmit() {
  profileForm.submit();
}

profileForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!profileForm.checkValidity()) {
    profileForm.reportValidity();
    return;
  }
  showReview();
});

document.getElementById("editBtn").addEventListener("click", editForm);
document.getElementById("confirmBtn").addEventListener("click", confirmSubmit);