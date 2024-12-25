from flask import (
  Blueprint,
  render_template
)
from bs4 import BeautifulSoup
import requests

cmd = Blueprint('cmd',__name__)

@cmd.route('/paster/<path>')
def paster(path):
  res = requests.get(f"https://pastebin.mozilla.org/{path}/raw")
  soup = BeautifulSoup(res.content, 'html.parser')
  val = res.text
  try:
    if soup.find('title').text == "404 Snippet not found":
      val = "Paste not found"
  except Exception as e:
    pass
  return render_template('other/paster.html', text=val, path=path),200
@cmd.route('/paster/<path>/raw')
def paster_raw(path):
  res = requests.get(f"https://pastebin.mozilla.org/{path}/raw")
  if res.status_code != 200:
    return "<h1>Paste not found</h1>", 404
  data = res.text.replace('>','&gt;').replace('<','&lt;').replace('"','&quot;')
  return f"""
  <!DOCTYPE html>
  <html>
    <head>
      <title>{path}</title>
    </head>
    <body>
      <pre style="font-family:serif">{data}</pre>
    </body>
  </html>
  """