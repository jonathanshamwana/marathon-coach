from flask import Flask
from flask_cors import CORS
from config import Config
from services.openai_api import openai_bp
from services.coach_flow import coach_bp
from services.gcalendar_api import calendar_bp
# from flask_migrate import Migrate

# Initiliaze the Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config.from_object(Config)

# Configure the database
# db.init_app(app)
# migrate = Migrate(app, db)

app.register_blueprint(openai_bp, url_prefix="/api/openai")
app.register_blueprint(coach_bp, url_prefix="/api/coach")
app.register_blueprint(calendar_bp, url_prefix="/api/calendar")

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the AI Marathon Coach API", 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)