from app.api_function import shoti as babae

def shoti(bot, data):
  if data.args:
    return bot.sendMessage(":danger-color[:icon[fa-solid fa-warning]]  This command dont need an argument.")
  loading = bot.sendMessage(":icon[fa-solid fa-circle-notch fa-spin] Generating a random shoti video...")
  try:
    res = None
    atemp = 0
    while True:
      if atemp == 3:
        bot.unsendMessage(loading['id'])
        return bot.sendMessage(":danger-color[:icon[fa-solid fa-warning]] " + res['error'])#("⚠️ An error accured while fetching the data, please try again.")
      deck = babae()
      if "error" not in deck:
        res = deck
        break
      atemp += 1
    line = "━━━━━━━━━━━━━━━━━━━━━"
    text = line + '\n'
    text += ":icon[fa-brands fa-tiktok] :bold[username]: " + f"![{res['username']}](https://tiktok.com/{res['username']})" + '\n'
    text += ":icon[fa-solid fa-eye] :bold[views]: " + res.get('views') + '\n'
    text += ":icon[fa-solid fa-comments] :bold[comments]: " + res.get('comments') + '\n'
    text += ":icon[fa-solid fa-share] :bold[shares]: " + res.get('shares') + '\n'
    text += ":icon[fa-solid fa-music] :bold[music]: " + res.get('music') + '\n'
    text += line + '\n'
    text += res.get('description') if res.get('description') != 'No description' else ''
    message = {
      "body": text,
      "attachment": {
        "src": res['videoSource'],
        "type": 'video'
      }
    }
    bot.unsendMessage(loading['id'])
    return bot.sendMessage(message)
  except Exception as e:
    print("ERROR: ", e)
    bot.unsendMessage(loading['id'])
    return bot.sendMessage(":danger-color[:icon[fa-solid fa-warning]]  An error accured while fetching the data, please try again.")

config = {
  "name": 'shoti',
  "def": shoti,
  "description": 'Generate a random sexy girl videos',
  "credits": 'Greegmon'
}