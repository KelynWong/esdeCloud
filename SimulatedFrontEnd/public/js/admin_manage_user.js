let $searchDesignFormContainer = document.getElementById('searchUserFormContainer');
if ($searchDesignFormContainer != null) {
    console.log('Search user form detected in manage user interface. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit search parameters
    //to server-side api when the #submitButton element fires the click event.
        document.getElementById("submitButton").addEventListener("click", function(event) {
        event.preventDefault();
        
        let searchInput = document.getElementById("searchInput").value;
        let userId = localStorage.getItem('user_id');
        let xhr = new XMLHttpRequest();
        xhr.open("GET", baseUrl + '/api/user/process-search-user/1/' + encodeURIComponent(searchInput));
        xhr.setRequestHeader('user',userId);
        xhr.setRequestHeader("authorization",'Bearer '+localStorage.getItem('token'))
        xhr.onreadystatechange = onreadystatechange;
        xhr.onerror =function(err){
            //console.error(err)
            new Noty({
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Unable to search',
            }).show();
        }
        xhr.send();
    });
    function onreadystatechange(){

        if(this.readyState=== XMLHttpRequest.DONE){
            if (this.status === 0 || (this.status >= 200 && this.status < 400)) {
                //Using the following to inspect the response.data data structure
            //before deciding the code which dynamically generates cards.
            //Each card describes a design record.
            //console.dir(response.data);
            const response = JSON.parse(this.responseText);
            const records = response.userdata;
            const totalNumOfRecords = response.total_number_of_records;
            console.dir(response)
            //Find the main container which displays page number buttons
            let $pageButtonContainer = document.getElementById("pagingButtonBlock")
            //Find the main container which has the id, dataBlock
            let $dataBlockContainer = document.getElementById('dataBlock');
            $dataBlockContainer.textContent="";
            $pageButtonContainer.textContent="";
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
                $card.classList.add("card-body");
                $card.style.width="18rem";
                let $cardBody =document.createElement("div");
                $cardBody.classList.add('card-body');
                let temp = document.createElement("h5");
                temp.classList.add('card-title')
                temp.textContent = record.fullname;
                $cardBody.appendChild(temp);
               let $editUserButtonBlock = document.createElement("div");
               $editUserButtonBlock.classList.add('col-md-2','float-right');
               temp = document.createElement('a');
               temp.textContent="Manage";
               temp.classList.add('btn','btn-primary');
               temp.href = 'update_user.html?id=' + encodeURIComponent(record.user_id);
                $editUserButtonBlock.appendChild(temp);
                $cardBody.append($editUserButtonBlock);
                temp = document.createElement('p');
                temp.classList.add('card-text');
                temp.textContent=record.email;
                $cardBody.appendChild(temp);
                if (record.role_name == 'admin') {
                    temp = document.createElement("img");
                    temp.src= '../images/admin.png';
                    temp.width=50;
                    temp.classList.add('text-right')
                    $cardBody.appendChild(temp);
                }
                $card.appendChild($cardBody);
                //After preparing all the necessary HTML elements to describe the user data,
                //I used the code below to insert the main parent element into the div element, dataBlock.
                $dataBlockContainer.appendChild($card);
                $dataBlockContainer.appendChild(document.createElement("h5"));
            } //End of for loop
            let totalPages = Math.ceil(totalNumOfRecords / 4);

            for (let count = 1; count <= totalPages; count++) {

                let $button =document.createElement("button"); //$(`<button class="btn btn-primary btn-sm" />`);
                $button.classList.add("btn","btn-primary","btn-sm");
                $button.textContent =count;
                $button.addEventListener("click",clickHandlerForPageButton);

                $pageButtonContainer.appendChild($button);
            } //End of for loop to add page buttons
            }else{
                console.error(this.statusText);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to search',
                }).show();
            }
        }
    }
    function clickHandlerForPageButton(event) {
        event.preventDefault();
        
        let userId = localStorage.getItem('user_id');
        let pageNumber = event.target.textContent.trim();
        let searchInput = document.getElementById("searchInput").value;
        console.log('Checking the button page number which raised the click event : ', pageNumber);
        let xhr = new XMLHttpRequest();
        xhr.open("get",baseUrl+'/api/user/process-search-user/' + pageNumber + '/' +encodeURIComponent(searchInput));
        xhr.setRequestHeader('user',userId);
        xhr.setRequestHeader("authorization",'Bearer '+localStorage.getItem('token'))
        xhr.onreadystatechange = onreadystatechange;
        xhr.onerror = function(err){
            //console.error(err)
            new Noty({
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Unable to search',
            }).show();
        }
        xhr.send()

    } //End of clickHandlerForPageButton
} //End of checking for $searchUserFormContainer jQuery object