let $searchDesignFormContainer = document.getElementById('searchDesignFormContainer');
if ($searchDesignFormContainer != null) {
    console.log('Search design form detected in user manage submission interface. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to send key-value pair information to do record searching
    //to server-side api when the #submitButton element fires the click event.
    document.getElementById('submitButton').addEventListener('click', function(event) {
        event.preventDefault();
        
        let searchInput = document.getElementById('searchInput').value;
        let userId = localStorage.getItem('user_id');
        let xhr = new XMLHttpRequest();
        xhr.open("GET",baseUrl + '/api/user/process-search-design/1/' + searchInput);
        xhr.setRequestHeader('user', userId);
        xhr.setRequestHeader("authorization",'Bearer '+localStorage.getItem('token'));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                    //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically generates cards.
                //Each card describes a design record.
                //console.dir(response.data);
                let response = JSON.parse(xhr.responseText);
                const records = response.filedata;
                const totalNumOfRecords = response.total_number_of_records;
                //Find the main container which displays page number buttons
                let $pageButtonContainer = document.getElementById('pagingButtonBlock');
                //Find the main container which has the id, dataBlock
                let $dataBlockContainer = document.getElementById('dataBlock');
                $dataBlockContainer.textContent='';
                $pageButtonContainer.textContent='';
                if (records.length == 0) {
                    new Noty({
                        type: 'information',
                        layout: 'topCenter',
                        timeout: '5000',
                        theme: 'sunset',
                        text: 'No submission records found.',
                    }).show();
                }
                for (let index = 0; index < records.length; index++) {
                    let record = records[index];
                    console.log(record.cloudinary_url);
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
                    temp.href= 'update_design.html?id=' + record.file_id;
                    $editDesignButtonBlock.appendChild(temp);
                    $cardBody.appendChild($editDesignButtonBlock);
                    temp =document.createElement('h5');
                    temp.classList.add('card-title')
                    temp.textContent = record.design_title
                    $cardBody.appendChild(temp);
                    temp = document.createElement('p');
                    temp.classList.add('card-text')
                    temp.textContent =record.design_description;
                    $cardBody.appendChild(temp);
                    $card.appendChild($cardBody);
                    //After preparing all the necessary HTML elements to describe the file data,
                    //I used the code below to insert the main parent element into the div element, dataBlock.
                    $dataBlockContainer.appendChild($card);
                    $dataBlockContainer.appendChild(document.createElement('h5'));
                } //End of for loop
                let totalPages = Math.ceil(totalNumOfRecords / 4);

                for (let count = 1; count <= totalPages; count++) {

                    let $button = document.createElement('button');
                    $button.classList.add("btn","btn-primary","btn-sm"); //$(`<button class="btn btn-primary btn-sm" />`);
                    $button.textContent= count;
                    $button.addEventListener('click',clickHandlerForPageButton);

                    $pageButtonContainer.appendChild($button);
                } //End of for loop to add page buttons

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
    //I have hard code 3 buttons for the manage-submission interface (user role)
    //to cut down the JavaScript code for this file.
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to make a HTTP GET
    //to server-side api.
    function clickHandlerForPageButton(event) {
        event.preventDefault();
        
        let userId = localStorage.getItem('user_id');
        let pageNumber = event.target.textContent.trim();
        let searchInput = document.getElementById('searchInput').value;
        console.log(pageNumber);
        let xhr = new XMLHttpRequest();
        xhr.open("GET",baseUrl + '/api/user/process-search-design/' + pageNumber + '/' + searchInput);
        xhr.setRequestHeader('user', userId);
        xhr.setRequestHeader("authorization",'Bearer '+localStorage.getItem('token'))
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
                    //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically generates cards.
                //Each card describes a design record.
                //console.dir(response.data);
                let response = JSON.parse(xhr.responseText);
                const records = response.filedata;
                const totalNumOfRecords = response.total_number_of_records;
                //Find the main container which displays page number buttons
                let $pageButtonContainer = document.getElementById('pagingButtonBlock');
                //Find the main container which has the id, dataBlock
                let $dataBlockContainer = document.getElementById('dataBlock');
                $dataBlockContainer.textContent='';
                $pageButtonContainer.textContent='';
                for (let index = 0; index < records.length; index++) {
                    let record = records[index];
                    console.log(record.cloudinary_url);
                    let $card = document.createElement('div');
                    $card.classList.add('card');
                    $card.style.width = "18rem";
                    // $('<div></div>').addClass('card').attr('style', 'width: 18rem;');
                    let temp = document.createElement('img');
                    temp.classList.add('card-img-top','app_thumbnail');
                    temp.src=record.cloudinary_url
                    $card.appendChild(temp);
                    let $cardBody = document.createElement('div') ;
                    $cardBody.classList.add('card-body');
                    let $editDesignButtonBlock = document.createElement('div')
                    $editDesignButtonBlock.classList.add('col-md-2','float-right');
                    temp = document.createElement('a');
                    temp.textContent='Update';
                    temp.classList.add('btn','btn-primary');
                    temp.href = 'update_design.html?id=' + record.file_id;
                    $editDesignButtonBlock.appendChild(temp);
                    $cardBody.append($editDesignButtonBlock);
                    temp =document.createElement('h5');
                    temp.classList.add('card-title');
                    temp.textContent = record.design_title;
                    $cardBody.appendChild(temp);
                    temp=document.createElement('p');
                    temp.classList.add('card-text');
                    temp.textContent = record.design_description;
                    $cardBody.appendChild(temp);
                    $card.appendChild($cardBody);
                    //After preparing all the necessary HTML elements to describe the file data,
                    //I used the code below to insert the main parent element into the div element, dataBlock.
                    $dataBlockContainer.appendChild($card);
                    $dataBlockContainer.appendChild(document.createElement('h5'));
                } //End of for loop
                let totalPages = Math.ceil(totalNumOfRecords / 4);
                console.log(totalPages);
                for (let count = 1; count <= totalPages; count++) {
                    temp =document.createElement('button');
                    temp.classList.add("btn","btn-primary","btn-sm");
                    temp.textContent=count;
                    temp.addEventListener('click',clickHandlerForPageButton);
                    $pageButtonContainer.appendChild(temp);
                }
                }else{
                    console.error(xhr.statusText);
                    new Noty({
                        type: 'error',
                        layout: 'topCenter',
                        theme: 'sunset',
                        text: 'Unable to search',
                    }).show();
                }
            }
        }
        xhr.onerror =function(err){
           // console.error(err);
            new Noty({
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Unable to search',
            }).show();
        }
        xhr.send();

    } //End of clickHandlerForPageButton
} //End of checking for $searchDesignFormContainer jQuery object