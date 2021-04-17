let $registerFormContainer = document.getElementById('registerFormContainer');
if ($registerFormContainer != null) {
    console.log('Registration form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    document.getElementById('submitButton').addEventListener('click', function(event) {
        event.preventDefault();
        
        let fullName = document.getElementById("fullNameInput").value
        let email = document.getElementById("emailInput").value
        let password = document.getElementById("passwordInput").value
        let xhr = new XMLHttpRequest();
        xhr.open("POST",baseUrl + '/api/user/register');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function(){
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                    console.dir(JSON.parse(xhr.responseText));
                    new Noty({
                        type: 'success',
                        timeout: '6000',
                        layout: 'topCenter',
                        theme: 'bootstrap-v4',
                        text: 'You have registered. Please login to your email account to verify it ',
                    }).show();
                }else{
                    console.error(xhr.statusText);
                new Noty({
                    timeout: '6000',
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to register.',
                }).show();
                }
            }
        }
        xhr.onerror = function(err){
           // console.error(err);
                new Noty({
                    timeout: '6000',
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to register.',
                }).show();
        }
         grecaptcha.ready(function () {
            grecaptcha.execute('6LdrHAEaAAAAAIwUQllvlC2DPy9n_4DtvF8hIi18', { action: 'submit' }).then(function (captcha) {
                xhr.send(JSON.stringify({fullName,email,password,captcha}));
            })
        });
    });

} //End of checking for $registerFormContainer jQuery object