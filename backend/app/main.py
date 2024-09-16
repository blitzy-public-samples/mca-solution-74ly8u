from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.api.applications import applications_bp
from app.api.documents import documents_bp
from app.api.webhooks import webhooks_bp
from app.api.users import users_bp
from app.core.config import settings
from app.db.database import init_db
from app.tasks.celery_tasks import celery_app

app = Flask(__name__)
jwt = JWTManager(app)

def create_app():
    app.config.from_object(settings)
    
    CORS(app)
    jwt.init_app(app)
    
    init_db(app)
    
    app.register_blueprint(applications_bp)
    app.register_blueprint(documents_bp)
    app.register_blueprint(webhooks_bp)
    app.register_blueprint(users_bp)
    
    # Configure error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"error": "Internal server error"}, 500
    
    return app

# HUMAN ASSISTANCE NEEDED
# The following function has a confidence level below 0.8 and may need adjustments for production readiness
def configure_celery(app):
    celery_app.conf.update(app.config)
    
    class ContextTask(celery_app.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
    
    celery_app.Task = ContextTask
    
    # Configure Celery task routes
    celery_app.conf.task_routes = {
        'app.tasks.*': {'queue': 'default'}
    }
    
    # Set up Celery beat schedule for periodic tasks
    celery_app.conf.beat_schedule = {
        'check-application-status': {
            'task': 'app.tasks.check_application_status',
            'schedule': 3600.0,  # Run every hour
        },
    }
    
    return celery_app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)