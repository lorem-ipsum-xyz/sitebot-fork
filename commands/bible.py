from app.api_function import random_bible_verse

def bible(bot, data):
  if data.args:
    return bot.sendMessage(":danger-color[:icon[fa-solid fa-warning]] This command dont need an argument")
  loading = bot.sendMessage(":icon[fa-solid fa-circle-notch fa-spin] Fetching data, please wait...")
  bible = random_bible_verse()
  bot.unsendMessage(loading['id'])
  if 'error' in bible:
    return bot.replyMessage(":danger-color[:icon[fa-solid fa-warning]] Error while getting a random verse", data.messageId)
  message = ":bold[:icon[fa-solid fa-bible] Random Verse]\n"
  message += bible['text'] + '\n\n'
  message += f"- {bible['verse']}"
  bot.sendMessage(message, data.messageId)

config = {
  "name": 'bible',
  "credits": "Greegmon",
  "description": "Generate a random bible verse",
  "def": bible
}