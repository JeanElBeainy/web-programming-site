// ======================================================
// SUBMIT BUTTON — LOADING STATE
// ======================================================
// Used by profile-form-validated.html. Sending the form to the server takes
// a moment, so while it is on its way the button says so and is disabled:
// the user knows it is working, and can't send the form twice.

const profileForm = document.querySelector("form");
const submitBtn = profileForm.querySelector('button[type="submit"]');

profileForm.addEventListener("submit", function () {
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";
});

// If the user comes back to this page with the browser's Back button, the
// browser can show the page exactly as it was left, with the button still
// disabled. "pageshow" runs every time the page is shown, so reset it there.
window.addEventListener("pageshow", function () {
  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Profile";
});

// ======================================================
// ERROR SUMMARY — ANNOUNCE IT
// ======================================================
// The summary arrives with the reloaded page instead of appearing later, and
// a screen reader does not always read out a role="alert" that was there from
// the start. Moving the focus onto it makes sure it is read, and the next Tab
// goes straight to the first problem's link.
const errorSummary = document.getElementById("error-summary");
if (errorSummary) {
  errorSummary.focus();
}
