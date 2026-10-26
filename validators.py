import re          # Python's built-in Regular Expressions (regex) module
from datetime import date
# ---- patterns (compiled once) -------------------------------------
STUDENT_ID = re.compile(r"^\d{9}$")     # exactly 9 digits
FULLNAME   = re.compile(r"^[A-Za-z][A-Za-z .'\-]{1,79}$")
             # letters/spaces/.'- , 2..80 chars
# Use AI to generate the patterns for email, phone, github, url, month,
# time, # and color. Ask it for explanation.
EMAIL      = re.compile(r"^[a-z0-9._-]+@(net\.)?usek\.edu\.lb$")    # name@usek.edu.lb or name@net.usek.edu.lb
PHONE      = re.compile(r"^\+961 ?\d{1,2} ?\d{6}$")                 # +961 70 123456 (spaces optional)
GITHUB     = re.compile(r"^https://github\.com/[A-Za-z0-9-]+/?$")  # https://github.com/username
HTTPS_URL  = re.compile(r"^https://\S+\.\S+$")                     # https:// then an address with a dot
MONTH      = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")                 # YYYY-MM, month 01..12
TIME       = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")               # HH:MM, 00:00..23:59
HEXCOLOR   = re.compile(r"^#[0-9A-Fa-f]{6}$")                       # # then 6 hex digits

# ---- allow-lists -------------------------------
MAJORS     = {"computer", "electrical", "biomedical", "telecommunications"}
GRADUATION = {"spring", "summer", "fall"}
YESNO      = {"yes", "no"}

# Do the same for other fields: skills, software, project areas ...
# SKILLS     =
# SOFTWARE   =
# PROJECT_AREAS =

# Set of required fields (same names as in the HTML form)
REQUIRED = {"student_id", "fullname", "email", "major", "graduation"}


def parse_date(text):
    try:
        return date.fromisoformat(text)
        # ISO YYY-MM-DD
    except ValueError:
        return None


def to_number(text):
    try:
        return float(text)
    except ValueError:
        return None


def validate_profile(form):
    errors = {}      # field name -> error message
    cleaned = {}     # field name -> trusted value

    # ---1. Required fields: must be present and not blank ------------
    for field in REQUIRED:
        if form.get(field, "").strip() == "":
            errors[field] = "This field is required."

    # ---2. Student ID: exactly 9 digits
    student_id = form.get("student_id", "").strip()
    if student_id != "" and not STUDENT_ID.match(student_id):
        errors["student_id"] = "Student ID must be exactly 9 digits."
    cleaned["student_id"] = student_id

    # ---3. Full name: letters, spaces, hyphens, apostrophes,2 to 80 chars
    # ---4. USEK email (we also lower-case it so it is stored consistently)
    # ---5. Lebanese phone number

    # ---6. Date of birth: a real date, not in the future, with a believable age
    birthdate = form.get("birthdate", "").strip()
    if birthdate != "":
        day = parse_date(birthdate)
        if day is None:
            errors["birthdate"] = "Not a valid date."
        elif day > date.today():
            errors["birthdate"] = "Date of birth cannot be in the future."
        else:
            age = (date.today() - day).days // 365
            if age < 15 or age > 100:
                errors["birthdate"] = "Age looks out of range."
    cleaned["birthdate"] = birthdate

    # ---7. GitHub link
    # ---8. GIN446 site link (any https:// link)

    # ---9. Major: must be one of the allowed majors
    major = form.get("major", "").strip().lower()
    if major != "" and major not in MAJORS:
        errors["major"] = "Choose a valid major."
    cleaned["major"] = major

    # ---10. GPA: a number between 40 and 100
    gpa = form.get("gpa", "").strip()
    if gpa != "":
        number = to_number(gpa)
        if number is None or number < 40 or number > 100:
            errors["gpa"] = "GPA must be a number between 40 and 100."
    cleaned["gpa"] = gpa

    # ---11. Credits: a whole number between 0 and 148
    # ---12. Expected graduation: spring / summer / fall
    # ---13. Graduation month: shape YYYY-MM
    graduation_month = form.get("graduation_month", "").strip()
    if graduation_month != "" and not MONTH.match(graduation_month):
        errors["graduation_month"] = "Use the month picker (YYYY-MM)."
    cleaned["graduation_month"] = graduation_month

    #---14. Internship completed: yes / no
    #---15. Primary language: free text, but keep it short

    #---16. Skills: checkboxes -> a list. Keep only values we recognise.
    skills = form.getlist("skills")
    good_skills = []
    bad_skills = []
    for skill in skills:
        if skill in SKILLS:
            good_skills.append(skill)
        else:
            bad_skills.append(skill)
    if bad_skills:
        errors["skills"] = "Unknown skill(s): " + ", ".join(bad_skills)
    cleaned["skills"] = good_skills

    #---17. Software: multi-select -> a list. Same idea as skills.
    #---18. Project title: at most 120 characters
    #---19. Project area: must be one of the allowed areas
    #---20. Description: at most 1000 characters

    #---21. Team size: a whole number from 1 to 4
    team_size = form.get("team_size", "").strip()
    if team_size != "":
        number = to_int(team_size)
        if number is None or number < 1 or number > 4:
            errors["team_size"] = "Team size must be a whole number from 1 to 4."
    cleaned["team_size"] = team_size

    #---22. Dashboard color: a hex colour like #336699 (default if left empty)
    project_color = form.get("project_color", "").strip()
    if project_color != "" and not HEXCOLOR.match(project_color):
        errors["project_color"] = "Use a colour like #336699."
    if project_color == "":
        project_color = "#336699"
    cleaned["project_color"] = project_color

    #---23. Meeting date: a real date
    #---24. Meeting time: shape HH:MM, between 08:00 and 18:00

    # Done: hand back the problems and the trusted values.
    return errors, cleaned