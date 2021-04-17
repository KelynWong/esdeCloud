let $updateDesignFormContainer = document.getElementById('updateDesignFormContainer');
let fileId
if ($updateDesignFormContainer != null) {
    console.log('Update Design form is detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit design details
    //to server-side api when the #submitButton element fires the click event.
    document.getElementById('submitButton').addEventListener('click', function(event) {
        event.preventDefault();
        
        //Obtain user id from local storage
        let userId = localStorage.getItem('user_id');
        //Collect design title and description input
        let designTitle = document.getElementById('designTitleInput').value;
        let designDescription = document.getElementById('designDescriptionInput').value;
        //Create a FormData object to build key-value pairs of information before
        //making a PUT HTTP request.
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", baseUrl + '/api/user/design/');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader('user', userId);
        xhr.setRequestHeader("authorization",'Bearer '+localStorage.getItem('token'));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                    new Noty({
                        type: 'success',
                        layout: 'topCenter',
                        theme: 'sunset',
                        timeout: '5000',
                        text: 'Updated design information.',
                    }).show();
                }else{
                    console.error(xhr.statusText)
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
        xhr.onerror=function(err){
            console.error(err);
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
                xhr.send(JSON.stringify({designTitle,designDescription,fileId,captcha}));
            })
        });
    });
    document.getElementById('backButton').addEventListener("click", function(e) {
        e.preventDefault();
        window.history.back();
    });

    function getOneData() {
        
        //Get the fileId information from the web browser URL textbox
        let query = new URLSearchParams(window.location.search);
        fileId = parseInt(query.get('id'));
        console.dir('Obtained file id from URL : ', fileId);
        let userId = localStorage.getItem('user_id');
        let xhr = new XMLHttpRequest();
        xhr.open("GET", baseUrl + '/api/user/design/' + fileId);
        xhr.setRequestHeader('user', userId);
        xhr.setRequestHeader("authorization",'Bearer '+localStorage.getItem('token'))
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically populate the elements with data.
                let response = JSON.parse(xhr.responseText);
                console.dir(response);
                const record = response.filedata;
                let designTitleInput = document.getElementById('designTitleInput');
                designTitleInput.value = record.design_title;
                designTitleInput.focus();
                document.getElementById('designDescriptionInput').value=record.design_description;
                document.getElementById('designImage').src = record.file_url;
                }else{
                    console.error(xhr.statusText);
                    new Noty({
                        type: 'error',
                        timeout: '6000',
                        layout: 'topCenter',
                        theme: 'sunset',
                        text: 'Unable retrieve file data',
                    }).show();
                }
            }
        }
        xhr.onerror =function(err){
           // console.error(err);
            new Noty({
                type: 'error',
                timeout: '6000',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Unable retrieve file data',
            }).show();
        }
        xhr.send();
    } //End of getOneData
    //Call getOneData function to do a GET HTTP request on an API to retrieve one user record
    getOneData(); //Call getOneData to begin populating the form input controls with the existing record information.
} //End of checking for $updateDesignFormContainer jQuery object