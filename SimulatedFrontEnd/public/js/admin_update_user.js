let $updateUserFormContainer = document.getElementById('updateUserFormContainer');
if ($updateUserFormContainer != null) {
    console.log('Update User form is detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit user role data
    //to server-side api when the #submitButton element fires the click event.
    document.getElementById('submitButton').addEventListener('click', function (event) {
        event.preventDefault();
        
        //Collect role id value from the input element, roleIdInput
        let roleId = parseInt(document.getElementById('roleIdInput').value);
        //Obtain user id from local storage
        let userId = localStorage.getItem('user_id');
        //There is a hidden textbox input, userRecordIdInput
        let recordId = parseInt(document.getElementById('userRecordIdInput').value);
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", baseUrl + '/api/user/')
        xhr.setRequestHeader('user', userId)
        xhr.setRequestHeader("authorization",'Bearer '+localStorage.getItem('token'))
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                    new Noty({
                        type: 'success',
                        layout: 'topCenter',
                        theme: 'sunset',
                        timeout: '5000',
                        text: 'User role has changed.',
                    }).show();
                } else {
                    console.error(xhr.statusText);
                    new Noty({
                        type: 'error',
                        layout: 'topCenter',
                        theme: 'sunset',
                        timeout: '6000',
                        text: 'Unable to update.',
                    }).show();
                }
            }
        }
        xhr.onerror = function (err) {
           // console.error(err);
            new Noty({
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                timeout: '6000',
                text: 'Unable to update.',
            }).show();
        }
        
        grecaptcha.ready(function () {
            grecaptcha.execute('6LdrHAEaAAAAAIwUQllvlC2DPy9n_4DtvF8hIi18', { action: 'submit' }).then(function (captcha) {
                xhr.send(JSON.stringify({ roleId, recordId,captcha }));
            })
        });
    })
    document.getElementById('backButton').addEventListener("click", function (e) {
        e.preventDefault();
        window.history.back();
    });

    function getOneUser() {

        
        var query = window.location.search.substring(1);
        let arrayData = query.split("=");
        let recordIdToSearchUserRecord = arrayData[1];
        let userId = localStorage.getItem('user_id');
        let xhr = new XMLHttpRequest();
        xhr.open("GET", baseUrl + '/api/user/' + recordIdToSearchUserRecord);
        xhr.setRequestHeader('user', userId);
        xhr.setRequestHeader("authorization",'Bearer '+localStorage.getItem('token'))
        xhr.onreadystatechange =function(){
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                let response = JSON.parse(xhr.responseText);
                console.dir(response);
                const record = response.userdata;
                document.getElementById('fullNameOutput').textContent = record.fullname;
                document.getElementById('emailOutput').textContent = record.email;
                document.getElementById('userRecordIdInput').value = record.user_id;
                document.getElementById('roleIdInput').value = record.role_id;
                }else{
                    console.error(xhr.statusText);
                    new Noty({
                        type: 'error',
                        timeout: '6000',
                        layout: 'topCenter',
                        theme: 'sunset',
                        text: 'Unable retrieve user data',
                    }).show();
                }
            }
        }
        xhr.onerror=function(err){
           // console.error(err);
            new Noty({
                type: 'error',
                timeout: '6000',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Unable retrieve user data',
            }).show();
        }
        xhr.send();

    } //End of getOneUser
    //Call getOneUser function to do a GET HTTP request on an API to retrieve one user record
    getOneUser();
} //End of checking for $updateUserFormContainer jQuery object