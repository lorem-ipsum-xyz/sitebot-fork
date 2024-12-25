// Auto scroll to the bottom message
function scroll(){
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
  const msg = document.getElementById('msg-cont');
  msg.scrollTop = msg.scrollHeight;
  //document.querySelector('.message_box:nth-last-child(1)').style.marginBottom = '2em'
}

// check if link or path
function attachCheck(src){
  if (src.includes('https://')){
    return src
  }else{
    return basePath + src
  }
}

// Create an attachemnt imagee
function createImage(attachment){
  const image = $('<img />', {
    src: attachCheck(attachment.src),
    alt: attachment?.title ?? 'No title!',
    height: attachment?.height ?? null
  })
  return image
}

// Creste video
function createVideo(video){
  return $("<video>")
    .attr('height', video?.height ?? null)
    .attr('controls', '')
    .append($("<source />").attr('src', attachCheck(video.src)))
}

function MATCHER(reg,text, func){
  let inp = text.match(reg)
  if (inp){
    func(inp)
  }
}
// Format the text
function text(text, $body){
  const span = (t) => `${t==='>'?'&gt':'&lt'}`;
  text = text.replace(/</g, span('<')).replace(/>/g, span('>'));
  text = text.replace(/\n/g, '<br>')
  
  const linkRegex = /!\[([^\]]+)\]\(([^\)]+)\)/g
  const iconRegex = /:icon\[(.*?)\]/g
  
  // link
  MATCHER(linkRegex, text, (links) => {
    for (const link of links){
      let [_XA,_XB] = link.split("](");
      text = text.replace(link, `<a target="_blank" href="${_XB.slice(0,_XB.length-1)}">${_XA.slice(2)}</a>`);
    }
  })
  // icon
  MATCHER(iconRegex, text, (icons) => {
    for (const icon of icons){
      text = text.replace(icon, `<i class="${icon.split(':icon[')[1].slice(0,icon.split(':icon[')[1].length-1)}"></i>`)
    }
  })
  // bold text
  MATCHER(/:bold\[(.*?)\]/g, text, (bolds) => {
    for (const bold of bolds){
      text = text.replace(bold, `<b>${bold.split(":bold[")[1].slice(0, bold.split(':bold[')[1].length-1)}</b>`)
    }
  })
  // text Color
  MATCHER(/:[a-zA-Z0-9\-]+\[(.*?)\]/g, text, ($COLORS)=>{
    for (const color of $COLORS){
      const $ind = color.indexOf('[');
      const $color = color.slice(1,$ind)
      const $text = color.slice($ind+1, color.length-1)
      switch ($color){
        case 'danger-color':
          text = text.replace(color, `<span style="color:#d9534f">${$text}</span>`)
        case 'warning-color':
          text = text.replace(color, `<span style="color:#f0ad4e">${$text}</span>`)
        case 'info-color':
          text = text.replace(color, `<span style="color:#5bc0de">${$text}</span>`)
        case 'success-color':
          text = text.replace(color, `<span style="color:#5cb85c">${$text}</span>`)
        case 'primary-color':
          text = text.replace(color, `<span style="color:#0275d8">${$text}</span>`)
      }
    }
  })
  $body.append($('<p>').html(text));
}

function displayMessage({ id, data, reply_to }, isUser=false){
  if (!data) return;
  const $messageBox = $('<div>')
    .addClass(`message_box ${isUser?'me':'other'}`)
    .attr('id', id);
  const $message = $('<div>')
    .addClass('message')
  const $label = $('<div>')
    .addClass('label').attr('data-text', isUser?'You':'BOT').text(isUser ? 'You':'BOT');
  const $mainMessage = $('<div>')
    .addClass('main-message');
  
  const $body = $('<div>').addClass('body');
  const $attachment = $('<div>').addClass('attachment').hide();
  const $skeleton = $('<div>').addClass('skeleton').append($('<div>').addClass('skeleton-image'));
  
  let hasBody = false;
  let hasAttach = false;
  
  if (reply_to) $label.text(`${isUser?'You':'BOT'} replied to ${reply_to.sender==='You'?'your':reply_to.sender} message`);
  else{
    if ($('.message_box:nth-last-child(1)').hasClass(isUser?'me':'other')){
      $('.message_box:nth-last-child(1)').css('margin-bottom', '3px')
      $($label).hide()
    }
  }
  
  if (typeof data === 'string'){text(data, $body);hasBody=true}
  else {
    const { body, attachment } = data;
    
    body ? hasBody=true:hasBody;
    if (attachment) attachment.length >= 1 ? hasAttach=true:hasAttach;
    
    // send Text
    hasBody ? text(body, $body):null
    
    // Send Attachment
    if (attachment){
      for (const attach of attachment){
        if (attach?.type === 'image'){
          const img = createImage(attach);
          img.attr('width', '49%')
          if ((attachment.indexOf(attach)%2)!==0) img.css('margin-left', '2%')
          if (attachment.length === 1) img.css('width','100%');
          img.on('load', () => {
            $skeleton.hide();
            $attachment.show()
          })
          $attachment.append(img)
        }else if(attach?.type === 'video'){
          const video = createVideo(attach);
          video.css('width', '100%')
          video.css('border-radius', '11px')
          video[0].onloadedmetadata = function(){
            $skeleton.hide();
            $attachment.show()
          }
          $attachment.append(video)
        }else{
          $skeleton.hide()
          $attachment.show()
          $attachment.append(
            $('<div>').addClass('invalidType').append(
              $('<div>')
              .addClass('text')
              .text('Invalid attachment type')
            )
          )
        }
      }
    }
  }
  
  if (hasBody) $mainMessage.append($body);
  if (hasAttach) $mainMessage.append($skeleton).append($attachment);
  $message.append($label).append($('<div>').addClass('__message').append($mainMessage));
  $messageBox.append($message);
  
  $('.messages').append($messageBox)
  
  $('.other .main-message').css('border-color', isDarkmode?'var(--semiDark)':'#c5c5c4');
  $('.other .body p').css('color', isDarkmode?'var(--text)':'#1f1f1d')
  PorEacg()
  scroll()
}

$('#rply-remove').click(function(){$('.REPLY').remove()})
function removeMe(cls){
  $(cls).hide()
  $(cls).html('')
}
function getMessages(){return $('.message')}
function PorEacg(){
  // View Image
  $('.attachment img').click(function(){
    const me = $(this)[0]
    Swal.fire({
      text: me.alt,
      imageUrl: me.src,
      imageAlt: me.alt,
      showConfirmButton: false
    })
  })
  // handle reply
  getMessages().each(function(_,message){
    //console.log(message)
    $(message).dblclick(()=>{
      showOtherClicks(message)
    })
  })
}

function showOtherClicks(data){
  const user = $(data).find('.label').attr('data-text')
  const messageID = $(data).parent().attr('id')
  let body = $(data).find('.body > p').html().replace(/<br>/g, '\n')
  let images = [];
  let videos = []
  $(data).find('img').each(function(){
    images.push($(this).attr('src'))
  })
  $(data).find('video > source').each(function(){
    videos.push($(this).attr('src'))
  })
  $('.REPLY').remove()
  const reply = $('<div>').addClass('REPLY')
  reply.html(`
    <div style="display:none">
      <p class="data-message_id">${messageID}</p>
      <p class="data-user">${user}</p>
      <p class="data-text">${body}</p>
      <p class="data-images">${images}</p>
      <p class="data-videos">${videos}</p>
    </div>
    <div class="rply-text">
      <p>Reply to ${user==='You'?'your':user+'\'s'} message</p>
    </div>
    <div class="rply-remove">
      <button id="rply-remove" onclick="removeMe('.REPLY')"><i class="fa-solid fa-remove"></i></button>
    </div>
  `)
  $('.input_container').prepend(reply)
}