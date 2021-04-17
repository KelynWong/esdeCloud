let $searchDesignFormContainer = document.getElementById('searchDesignFormContainer');
let token = new URLSearchParams(location.hash).get("access_token");
if(token){
    localStorage.setItem("token",token);
}
if ($searchDesignFormContainer != null) {
    console.log('Search design form detected in user manage submission interface. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to send key-value pair information to do record searching
    //to server-side api when the #submitButton element fires the click event.
    document.getElementById('submitButton').addEventListener('click', function(event) {
        event.preventDefault();
        let searchInput = document.getElementById('searchInput').value.trim();
        let xhr = new XMLHttpRequest();
        if(searchInput){
            xhr.open("GET",baseUrl + '/api/design?search=' + encodeURIComponent(searchInput));
        }else{
            xhr.open("GET",baseUrl + '/api/design');
        }
        xhr.setRequestHeader("Authorization",localStorage.getItem('token'));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status ===200) {
                    //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically generates cards.
                //Each card describes a design record.
                //console.dir(response.data);
                let response = JSON.parse(xhr.responseText);
                //Find the main container which displays page number buttons
                //Find the main container which has the id, dataBlock
                let $dataBlockContainer = document.getElementById('dataBlock');
                $dataBlockContainer.textContent='';
                if (response.length == 0) {
                    new Noty({
                        type: 'information',
                        layout: 'topCenter',
                        timeout: '5000',
                        theme: 'sunset',
                        text: 'No submission records found.',
                    }).show();
                }
                for (let index = 0; index < response.length; index++) {
                    let record = response [index];
                    let $card =document.createElement("div");
                    $card.classList.add('card');
                    $card.style.width="18rem"; // $('<div></div>').addClass('card').attr('style', 'width: 18rem;');
                    let temp = document.createElement('img')
                    temp.classList.add('card-img-top','app_thumbnail');
                    temp.src = record.file_url;
                    $card.appendChild(temp);
                    let $cardBody = document.createElement('div');
                    $cardBody.classList.add('card-body');
                    let $editDesignButtonBlock = document.createElement('div');
                    $editDesignButtonBlock.classList.add('col-md-2','float-right');
                    temp = document.createElement('a');
                    temp.textContent='Update';
                    temp.classList.add('btn','btn-primary');
                    temp.href= 'update_design.html?id=' + record.id;
                    $editDesignButtonBlock.appendChild(temp);
                    $cardBody.appendChild($editDesignButtonBlock);
                    temp =document.createElement('h5');
                    temp.classList.add('card-title')
                    temp.textContent = record.design_title.S
                    $cardBody.appendChild(temp);
                    temp = document.createElement('p');
                    temp.classList.add('card-text')
                    temp.textContent =record.design_description.S;
                    $cardBody.appendChild(temp);
                    $card.appendChild($cardBody);
                    //After preparing all the necessary HTML elements to describe the file data,
                    //I used the code below to insert the main parent element into the div element, dataBlock.
                    $dataBlockContainer.appendChild($card);
                    $dataBlockContainer.appendChild(document.createElement('h5'));
                } //End of for loop

                }else{
                    console.error(xhr.statusText);
                    new Noty({
                        type: 'error',
                        layout: 'topCenter',
                        timeout: '5000',
                        theme: 'sunset',
                        text: 'Unable to search',
                    }).show();
                }
            }
        }
        xhr.onerror=function(err){
            console.error(err);
            new Noty({
                type: 'error',
                layout: 'topCenter',
                timeout: '5000',
                theme: 'sunset',
                text: 'Unable to search',
            }).show();
        }
        xhr.send();
    });
} //End of checking for $searchDesignFormContainer jQuery object