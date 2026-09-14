"""
Web Programming — starter Flask application (Week 1).

A minimal server that renders the portfolio home page. Over the semester you
will add routes here; for now it serves a single page from the templates folder.
"""

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    """Serve the portfolio home page."""
    # The list of weekly work grows as the semester goes on.
    weekly_work = [
        # {"week": 1, "title": "Live site launched", "url": "/"},
    ]
    return render_template("index.html", weekly_work=weekly_work)


if __name__ == "__main__":
    # For local development only. In production, Render runs the app with
    # gunicorn (see the Procfile), not this block.
    app.run(debug=True)
"""
Web Programming — Flask application.
Serves the portfolio home page and the Week 2 history pages.
"""

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    """Serve the portfolio home page."""
    weekly_work = [
        {"week": 1, "title": "Live site launched", "url": "/"},
        {"week": 2, "title": "History of the Internet", "url": "/internet-history"},
        {"week": 2, "title": "History of the Web", "url": "/web-history"},
    ]
    return render_template("index.html", weekly_work=weekly_work)


@app.route("/internet-history")
def internet_history():
    return render_template("internet-history.html")


@app.route("/web-history")
def web_history():
    return render_template("web-history.html")


if __name__ == "__main__":
    app.run(debug=True)
