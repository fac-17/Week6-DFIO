const newUsernameField = document.querySelector('#new-username');
const newPasswordField = document.querySelector('#new-password');
const loginUsernameField = document.querySelector('#login-username');
const loginPasswordField = document.querySelector('#login-password');

const newUserForm =  document.querySelector('.create-form');
const loginForm = document.querySelector('.login-form')
//input validation
newUsernameField.addEventListener('input', (e) => {
   newUsernameField.setCustomValidity('');
})
newUsernameField.addEventListener('invalid',(e)=> {
  e.target.setCustomValidity("");
    if (!e.target.validity.valid) {
      e.target.setCustomValidity("Username must be lowercase or numbers only, without spaces");
    }
})

newPasswordField.addEventListener('input', (e) => {
   newPasswordField.setCustomValidity('');
})
newPasswordField.addEventListener('invalid',(e)=> {
  e.target.setCustomValidity("");
    if (!e.target.validity.valid) {
      e.target.setCustomValidity("Password must be 6 characters with at least one lower case, one upper case and one number");
    }
})

loginUsernameField.addEventListener('input', (e) => {
   loginUsernameField.setCustomValidity('');
})
loginUsernameField.addEventListener('invalid',(e)=> {
  e.target.setCustomValidity("");
    if (!e.target.validity.valid) {
      e.target.setCustomValidity("Username must be lowercase or numbers only, without spaces");
    }
})

loginPasswordField.addEventListener('input', (e) => {
   loginPasswordField.setCustomValidity('');
})
loginPasswordField.addEventListener('invalid',(e)=> {
  e.target.setCustomValidity("");
    if (!e.target.validity.valid) {
      e.target.setCustomValidity("Password must be 6 characters with at least one lower case, one upper case and one number");
    }
})
//submit events
newUserForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  newUsernameField.checkValidity();
  newPasswordField.checkValidity();
  const xhr = new XMLHttpRequest();
  const url = e.target.action;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {

      console.log('userExists is',xhr.responseText)
    }
  };
  xhr.open("POST", url);
  xhr.send(`username=${loginUsernameField.value}&password=${loginPasswordField.value}`);
})

loginForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  loginUsernameField.checkValidity();
  loginPasswordField.checkValidity();
  const xhr = new XMLHttpRequest();
  const url = e.target.action;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log('login status is', xhr.responseText)
    }
  };
  xhr.open("POST", url);
  console.log('url for login is',url);
  xhr.send(new URLSearchParams(new FormData(event.target)))
})
