import os
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config import Config

# Import blueprints
from services.coach_flow import coach_bp
from services.gcalendar import calendar_bp

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Set configuration based on environment
    if os.environ.get('FLASK_ENV') == 'production':
        app.config.from_object('config.ProductionConfig')
    else:
        app.config.from_object('config.DevelopmentConfig')
    
    # Rate limiting
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"]
    )
    
    # CORS configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', ['http://localhost:3000']),
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    app.register_blueprint(coach_bp, url_prefix="/api/coach")
    app.register_blueprint(calendar_bp, url_prefix="/api/calendar")
    
    @app.route('/', methods=['GET'])
    def index():
        return {"message": "Welcome to the AI Marathon Coach API", "status": "healthy"}, 200
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy"}, 200
    
    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    # Only run in development
    if app.config.get('DEBUG', False):
        app.run(debug=True, port=5000)
    else:
        print("Production mode: Use gunicorn to run the application")