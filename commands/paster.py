from app.api_function import paster

def Paster(bot, data):
  if not data.args:
    return bot.sendMessage(":danger-color[:icon[fa-solid fa-warning]] No text provided. Please use the format /paster <text>.")
  loading = bot.sendMessage(":icon[fa-solid fa-circle-notch fa-spin] Pasting your text, please wait...")
  yui = paster(data.pretty_args)
  bot.unsendMessage(loading['id'])
  if "error" in yui:
    return bot.sendMessage(":danger-color[:icon[fa-solid fa-warning]] An error accured while pasting the text")
  message = ""
  message += f":icon[fa-solid fa-clock] :bold[expires in: ]{yui['expire']}\n\n"
  message += f":icon[fa-solid fa-paste] Path: ![{yui['path']}]({yui['path']})"
  bot.sendMessage(message)

config = {
  "name": 'paster',
  "credits": 'Greegmon',
  "def": Paster,
  "usage": "{p}paster <text>",
  "description": "Paste your text and allow other to see it"
}