let $loginFormContainer = document.getElementById('loginFormContainer');
if ($loginFormContainer != null) {
    if(/emailVerify=1/.test(window.location.search)){
        new Noty({
            type: 'success',
            timeout: '6000',
            layout: 'topCenter',
            theme: 'bootstrap-v4',
            text: 'Your email have been vilified',
        }).show();
    }
    console.log('Login form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    document.getElementById('submitButton').addEventListener('click', function (event) {
        event.preventDefault();
        let email = document.getElementById('emailInput').value;
        let password = document.getElementById('passwordInput').value;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", baseUrl + '/api/user/login');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                    //Inspect the object structure of the response object.
                    //console.log('Inspecting the respsone object returned from the login web api');
                    //console.dir(response);
                    let userData = JSON.parse(xhr.responseText);
                    console.dir(userData);
                    switch (userData.role_name) {
                        case 'user':
                            localStorage.setItem('token', userData.token);
                            localStorage.setItem('user_id', userData.user_id);
                            localStorage.setItem('role_name', userData.role_name);
                            window.location.replace('user/manage_submission.html');
                            break;
                        case 'admin':
                            localStorage.setItem('token', userData.token);
                            localStorage.setItem('user_id', userData.user_id);
                            localStorage.setItem('role_name', userData.role_name);
                            window.location.replace('admin/manage_users.html');
                            break;
                    }
                } else {
                    console.error(xhr.statusText);
                    new Noty({
                        type: 'error',
                        layout: 'topCenter',
                        theme: 'sunset',
                        timeout: '6000',
                        text: 'Unable to login. Check your email and password',
                    }).show();
                }
            }
        }
        xhr.onerror = function (err) {
            err.preventDefault()
          //  console.error(err);
            new Noty({
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                timeout: '6000',
                text: 'Unable to login. Check your email and password',
            }).show();
        }
        grecaptcha.ready(function () {
            grecaptcha.execute('6LdrHAEaAAAAAIwUQllvlC2DPy9n_4DtvF8hIi18', { action: 'login' }).then(function (captcha) {
                let outPut = JSON.stringify({ email, password, captcha })
                xhr.send(outPut);
            })
        });

    })
} //End of checking for $loginFormContainer jQuery object