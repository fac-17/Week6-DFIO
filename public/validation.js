console.log('hello');
const newUsernameField = document.querySelector('#new-username');
const loginUsernameField = document.querySelector('#login-username');
const newPasswordField = document.querySelector('#new-password');
const loginPasswordField = document.querySelector('#login-password');
const createForm = document.querySelector('.create-form');
const newUserForm = document.querySelector('.login-form');
// submit event listener on the form that checks validity using validity.patternmismatch 
// and sets a custom validity and also prevents default

createForm.addEventListener('submit', (event) => {
    if (newPasswordField.validity.patternMismatch) {
        event.preventDefault();
        newPasswordField.setCustomValidity('Please enter a password')
    }


})
newPasswordField.addEventListener('input', () => {
    newPasswordField.setCustomValidity('');
})


// newUsernameField.setCustomValidity('Username must be lowercase letters and numbers only');
// loginUsernameField.setCustomValidity('Username must be lowercase letters and numbers only');

// newPasswordField.setCustomValidity('Password must be 6 characters with at least one lower case, one upper case and one number');
// loginPasswordField.setCustomValidity('Password must be 6 characters with at least one lower case, one upper case and one number');