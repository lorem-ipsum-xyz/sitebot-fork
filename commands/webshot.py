from app.api_function import website_screenshot

def webshot(bot, data):
  if not data.args:
    return bot.errorMessage(f"Missing input, type {bot.prefix}help webshot' to  see the usage")
  loading = bot.sendMessage(f":icon[fa-solid fa-circle-notch fa-spin] Taking screenshot, please wait...")
  try:
    it = website_screenshot(data.args)
    if 'error' in it:
      bot.unsendMessage(loading['id'])
      return bot.errorMessage(it['error'])
    bot.unsendMessage(loading['id'])
    bot.sendMessage({
      "body": f":icon[fa-solid fa-camera] :bold[Webshot:] ![{data.args}]({data.args})",
      "attachment": {
        "src": it['image'],
        "type": 'image',
        "title": data.args
      }
    })
  except Exception as e:
    bot.unsendMessage(loading['id'])
    print("ERROR: ", e)
    bot.errorMessage("An error accured while taking an screenshot.")

config = {
  "name": 'webshot',
  "def": webshot,
  "credits": 'Greegmon',
  "usage": '{p}webshot <link>',
  "description": 'Capture screenshot from the website'
}