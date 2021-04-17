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
        let webFormData = new FormData();
        webFormData.append('designTitle', designTitle);
        webFormData.append('designDescription', designDescription);
        //HTML file input, chosen by user
        webFormData.append("file", fileInput);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', baseUrl + '/api/design');
        xhr.setRequestHeader('user', userId);
        xhr.setRequestHeader("Authorization",localStorage.getItem('token'))

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 201) {
                    let response = JSON.parse(xhr.responseText);
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
        xhr.send(webFormData);
    });

} //End of checking for $submitDesignFormContainer jQuery object