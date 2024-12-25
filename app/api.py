from flask import (
  Blueprint,
  jsonify,
  request
)
from bs4 import BeautifulSoup
import requests

from .api_function import (
  tiktok_downloader,
  shoti,
  random_bible_verse,
  paster,
  facebook_downloader,
  website_screenshot,
  imgbb
)

api = Blueprint('api', __name__)

# tiktok video downloader
@api.route('/tiktokdl')
def api_tiktok_download():
  url = request.args.get('url')
  if not url:
    return jsonify({"error": 'Missing url parameter'}),422
  data = tiktok_downloader(url)
  status = 200 if 'error' not in data else 500
  return jsonify(data), status

# random shoti video
@api.route('/shoti')
def api_shoti():
  data = shoti()
  status = 200 if 'error' not in data else 500
  return jsonify(data), status

# Generate random bible verse
@api.route('/bible')
def api_random_verse():
  data = random_bible_verse()
  status = 200 if 'error' not in data else 500
  return jsonify(data), status

# Paster, like pastebin
@api.route('paster', methods=['POST'])
def api_paster():
  data = request.json
  text = data.get('text')
  if not text:
    return jsonify({"error": "Bobo mag lagay ka ng texts sa 'text' key"}),403
  response = paster(text)
  status = 200 if 'error' not in response else 500
  return jsonify(response), status

# facebook video/reels downloader
@api.route('fbdl')
def api_facebook_video_downloader():
  url = request.args.get('url')
  if not url:
    return jsonify({"error": 'Missing url parameter'}),422
  data = facebook_downloader(url)
  status = 200 if 'error' not in data else 500
  return jsonify(data), status

# Website capture screenshot
@api.route('webshot')
def api_website_screenshot():
  url = request.args.get('url')
  if not url or not url.startswith('https://'):
    return jsonify({"error": "Missing url parameter" if not url else "Invalid url"}),400
  data = website_screenshot(url)
  return jsonify(data), 200 if 'error' not in data else 500

# Imgbb upload image
@api.route('imgbb')
def api_imgbb():
  url = request.args.get('url')
  if not url or not url.startswith('https://'):
    return jsonify({"error": "Missing url parameter" if not url else "Invalid url"}),400
  data = imgbb(url)
  return jsonify(data), 200 if 'error' not in data else 500