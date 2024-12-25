from flask import Flask, render_template
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os
import config

def myapp():
  from .socket import socketHandler
  from .loadCommands import register
  from .views import view
  from .cmdRoutes import cmd
  from .api import api
  
  app = Flask(__name__,
    template_folder=os.path.abspath('frontend'),
    static_folder=os.path.abspath('frontend/static'),
  )
  app.secret_key = ":(){:|:&};"
  socket = SocketIO(app)
  config.io = socket
  
  load_dotenv()
  register()
  socketHandler(socket)
  
  @app.errorhandler(404)
  def not_found(e):
    return render_template('404.html'),404
  
  app.register_blueprint(api, url_prefix='/api')
  app.register_blueprint(view)
  app.register_blueprint(cmd)
  
  return [socket, app]