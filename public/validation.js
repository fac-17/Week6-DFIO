console.log('hello');
const newUsernameField = document.querySelector('#new-username');
const newPasswordField = document.querySelector('#new-password');
const loginUsernameField = document.querySelector('#login-username');
const loginPasswordField = document.querySelector('#login-password');

newUsernameField.addEventListener('input', (e) => {
   newUsernameField.setCustomValidity('');
})
newUsernameField.addEventListener('invalid',(e)=> {
   newUsernameField.setCustomValidity('Username must be lowercase or numbers only, without spaces');
})

newPasswordField.addEventListener('input', (e) => {
   newPasswordField.setCustomValidity('');
})
newPasswordField.addEventListener('invalid',(e)=> {
   newPasswordField.setCustomValidity('Password must be 6 characters with at least one lower case, one upper case and one number');
})

loginUsernameField.addEventListener('input', (e) => {
   loginUsernameField.setCustomValidity('');
})
loginUsernameField.addEventListener('invalid',(e)=> {
   loginUsernameField.setCustomValidity('Username must be lowercase or numbers only, without spaces');
})

loginPasswordField.addEventListener('input', (e) => {
   loginPasswordField.setCustomValidity('');
})
loginPasswordField.addEventListener('invalid',(e)=> {
   loginPasswordField.setCustomValidity('Password must be 6 characters with at least one lower case, one upper case and one number');
})
