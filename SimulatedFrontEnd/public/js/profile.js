let $profileContainer = document.getElementById('#profileContainer');
if ($profileContainer != null) {
    console.log('Profile page is detected. Binding event handling logic to form elements.');
    document.getElementById('backButton').addEventListener("click", function(e){
        e.preventDefault();
        window.history.back();
    });

    function getOneUser() {

        

        let userId = localStorage.getItem('user_id');
        let xhr = new XMLHttpRequest();
        xhr.open("GET", baseUrl + '/api/user/' + userId);
        xhr.setRequestHeader('user', userId);
        xhr.setRequestHeader("authorization",'Bearer '+localStorage.getItem('token'))
        xhr.onreadystatechange = function(){
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                    response = JSON.stringify(xhr.responseText)
                    console.dir(response);
                    const record = response.userdata;
                    document.getElementById('fullNameOutput').textContent = record.fullname;
                    document.getElementById('emailOutput').textContent = record.email;
                }else{
                    console.error(xhr.statusText);
                    new Noty({
                        type: 'error',
                        timeout: '6000',
                        layout: 'topCenter',
                        theme: 'sunset',
                        text: 'Unable retrieve profile data',
                    }).show();
                }
            }
        }
        xhr.onerror = function(err){
          //  console.error(err)
            new Noty({
                type: 'error',
                timeout: '6000',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Unable retrieve profile data',
            }).show();
        }
    } //End of getOneUser
    //Call getOneUser function to do a GET HTTP request on an API to retrieve one user record
    getOneUser();
} //End of checking for $profileContainer jQuery object