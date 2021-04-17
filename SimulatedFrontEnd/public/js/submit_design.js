let $submitDesignFormContainer = document.getElementById('submitDesignFormContainer');
if ($submitDesignFormContainer != null) {
    console.log('Submit design form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit design details
    //to server-side api when the #submitButton element fires the click event.
    document.getElementById('submitButton').addEventListener('click', function (event) {
        event.preventDefault();

        let userId = localStorage.getItem('user_id');
        let designTitle = document.getElementById('designTitleInput').value;
        let designDescription = document.getElementById('designDescriptionInput').value;
        let fileInput = document.getElementById('fileInput').files[0]
       // let webFormData = new FormData();
        // webFormData.append('designTitle', designTitle);
        // webFormData.append('designDescription', designDescription);
        // // HTML file input, chosen by user
        // webFormData.append("file", fileInput);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', baseUrl + '/api/user/process-submission');
        xhr.setRequestHeader('user', userId);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("authorization", 'Bearer ' + localStorage.getItem('token'))

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 201) {
                    let response = JSON.parse(xhr.responseText);
                    let xhr2 = new XMLHttpRequest();
                    let formData = new FormData();

                    xhr2.open("POST", response.url);
                    Object.entries(response.fields).forEach(function([x,y]){formData.append(x,y)});
                    formData.append("file",fileInput);
                    formData.append("Content-Type",fileInput.type);
                    xhr2.onreadystatechange = function () {
                        if (xhr2.readyState === XMLHttpRequest.DONE) {
                            if (xhr2.status ===204 ) {
                                Noty.overrideDefaults({
                                    callbacks: {
                                        onTemplate: function () {
                                            if (this.options.type === 'systemresponse') {
                                                let div = document.createElement('div');
                                                div.classList.add('my-custom-template', 'noty_body');
                                                let temp = document.createElement('div');
                                                temp.classList.add("noty-header");
                                                temp.textContent = "Message";
                                                div.appendChild(temp);
                                                temp = document.createElement("p");
                                                temp.classList.add("noty-message-body");
                                                temp.textContent = this.options.text;
                                                div.appendChild(temp);
                                                temp = document.createElement("img");
                                                temp.src = this.options.imageURL;
                                                div.appendChild(temp);
                                                this.barDom.textContent = "";
                                                this.barDom.appendChild(div);
                                            }
                                        }
                                    }
                                })
                                console.log(response)
                                var fr = new FileReader();
                                fr.onload = function () {
                                    new Noty({
                                        type: 'systemresponse',
                                        layout: 'topCenter',
                                        timeout: '5000',
                                        text: 'File submission completed.',
                                        imageURL: fr.result
                                    }).show();
                                }
                                fr.readAsDataURL(fileInput);
                                
                            }
                        }
                    }
                    xhr2.send(formData);

                } else {
                    console.error(xhr.statusText);
                    new Noty({
                        type: 'error',
                        timeout: '6000',
                        layout: 'topCenter',
                        theme: 'sunset',
                        text: 'Unable to submit design file.',
                    }).show();
                }
            }
        }
        xhr.onerror = function (err) {
            // console.error(err);
            new Noty({
                type: 'error',
                timeout: '6000',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Unable to submit design file.',
            }).show();
        }
        grecaptcha.ready(function () {
            grecaptcha.execute('6LdrHAEaAAAAAIwUQllvlC2DPy9n_4DtvF8hIi18', { action: 'submit' }).then(function (captcha) {
               // webFormData.set("captcha", captcha);
                xhr.send(JSON.stringify({ captcha, designTitle, designDescription, file: fileInput.name ,file_type:fileInput.type}));
            })
        });
    });

} //End of checking for $submitDesignFormContainer jQuery object