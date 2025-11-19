document.getElementById('contact-form').addEventListener('submit',(e)=>{
  e.preventDefault();
  const messages=JSON.parse(localStorage.getItem('messages'))||[];
  messages.push({
    name:document.getElementById('name').value,
    email:document.getElementById('email').value,
    message:document.getElementById('message').value,
    date:new Date()
  });
  localStorage.setItem('messages',JSON.stringify(messages));
  alert('Message envoyé !'); e.target.reset();
});
