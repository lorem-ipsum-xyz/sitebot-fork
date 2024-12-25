const sendMessage = displayMessage;

io.emit('join', Room)

function reply_to(id){
  if (!id) return null;
  if ($(`#${id}`).length === 0) {
    return {
      error: `⚠️ Message ID not found. Can't reply to the message`
    }
  }
  const data = $(`#${id} > .message`)
  const $user = $(data).find('.label').text()
  const $messageID = $(data).parent().attr('id')
  let $body = $(data).find('.body > p').html().replace(/<br>/g, '\n')
  let $images = [];
  let $videos = []
  $(data).find('img').each(function(){
    $images.push($(this).attr('src'))
  })
  $(data).find('video > source').each(function(){
    $videos.push($(this).attr('src'))
  })
  return {
    id: $messageID,
    text: $body,
    sender: $user,
    image: $images,
    video: $videos
  }
}

io.on('sendMessage', (msg) => {
  const reply = reply_to(msg?.reply)
  if (reply?.error){
    sendMessage({
      data: reply.error,
      id: msg.id
    })
  }else{
    sendMessage({
      data: msg.data,
      reply_to: reply,
      id: msg.id
    })
  }
})

io.on('unsendMessage', (data) => {
  $(`#${data.id}`).remove()
})


// random message id
function messageID(count){
  const char = "abcdefghijklmnopqrstuvwxyz1237654098QWERTYUIOPASDFGHJKLZXCVBNM";
  let id = 'MSG-'
  for (let i=0;i<count*2;i++){
    const index = Math.floor(Math.random() * char.length)
    id += char[index-1]
  }
  return id
}

function getReplyData(){
  const sender = $('.REPLY .data-user').text()
  const messageID = $('.REPLY .data-message_id').text()
  const text = $('.REPLY .data-text').text()
  let images = $('.REPLY .data-images').text()
  let videos = $('.REPLY .data-videos').text()
  if (images) images = images.split(',');
  if (videos) videos = videos.split(',');
  $('.REPLY').remove()
  return {
    id: messageID,
    text: text,
    sender: sender,
    images: images || [],
    videos: videos || []
  }
}
function execute(){
  const input = $('#input');
  const value = input.val().trim();
  let data = null;
  if ($('.REPLY').is(':visible')) data = getReplyData();
  if (value){
    const $ID = messageID(20)
    sendMessage({
      data: value,
      reply_to: data ? {
        id: data?.id,
        text: data?.text,
        image: data?.images,
        video: data?.video,
        sender: data?.sender
      }:null,
      id: $ID
    }, true)
    input.val('');
    io.emit('recieveMessage', {
      text: value,
      reply_to: data ?? '',
      id: $ID,
      room: Room
    });
  }
}