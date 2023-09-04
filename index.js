// Declarations
let addedParamCount = 0;
let mainParamBox = document.getElementById('paramBoxMain');
let jsonBox = document.getElementById('jsonBox');
let getReqRadio = document.getElementById('req-type-get');
let postReqRadio = document.getElementById('req-type-post');
let paramRadio = document.getElementById('content-type-params');
let jsonRadio = document.getElementById('content-type-json');
let contentTypeBox = document.getElementById('content-type-box');
let addParamBtn = document.getElementById('addParamBtn');
let submitBtn = document.getElementById('submit');
let responseBox = document.getElementById('responsePrism');
let mainResBox = document.getElementById('responseBox');

// Initial States
getReqRadio.checked = true;
postReqRadio.checked = false;
contentTypeBox.style.display = 'none';
paramRadio.checked = false;
mainParamBox.style.display = 'none';
jsonRadio.checked = true;
jsonBox.style.display = 'none';
mainResBox.style.display = 'none';

// Utility Functions
function getElementByString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}

// Event Listeners
getReqRadio.addEventListener('click', () => {
    contentTypeBox.style.display = 'none';
    jsonBox.style.display = 'none';
    mainParamBox.style.display = 'none';
});

postReqRadio.addEventListener('click', () => {
    contentTypeBox.style.display = 'block';
    jsonRadio.checked = true;
    jsonBox.style.display = 'block';
});

paramRadio.addEventListener('click', () => {
    jsonBox.style.display = 'none';
    mainParamBox.style.display = 'block';
});

jsonRadio.addEventListener('click', () => {
    mainParamBox.style.display = 'none';
    jsonBox.style.display = 'block';
});

addParamBtn.addEventListener('click', () => {
    addedParamCount++;
    let newParamStr = `<div id="param-${addedParamCount}" class="my-3">
                            <div class="fw-semibold">Parameter ${addedParamCount}</div>
                            <div class="row g-3">
                                <div class="col-md-11">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label for="param-key-${addedParamCount}" class="form-label">Key<span class="text-danger fw-semibold">&nbsp;*</span></label>
                                            <input type="text" class="form-control" id="param-key-${addedParamCount}" placeholder="Key">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="param-val-${addedParamCount}" class="form-label">Value<span class="text-danger fw-semibold">&nbsp;*</span></label>
                                            <input type="text" class="form-control" id="param-val-${addedParamCount}" placeholder="Value">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-1 d-flex align-items-end">
                                    <button type="button" class="mt-auto fw-semibold btn btn-danger delParamBtn">X</button>
                                </div>
                            </div>
                        </div>`;
    let newParamElement = getElementByString(newParamStr);
    mainParamBox.appendChild(newParamElement);
    let delParamBtns = document.getElementsByClassName('delParamBtn');
    for(item of delParamBtns){
        item.addEventListener('click', (e) => {
            e.target.parentElement.parentElement.parentElement.remove();
        });
    }
});

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mainResBox.style.display = 'block';
    responseBox.innerHTML = 'Fetching response... Please wait!';
    Prism.highlightAll();

    let url = document.getElementById('url').value;
    let requestType = document.querySelector("input[name='req-type']:checked").value;
    let contentType = document.querySelector("input[name='content-type']:checked").value;
    let requestDataStr;

    if(contentType == 'parameters'){
        requestDataStr = {};
        for(let i = 0; i < addedParamCount; i++){
            if(document.getElementById('param-' + (i + 1)) != undefined){
                let paramKey = document.getElementById('param-key-' + addedParamCount).value;
                let paramVal = document.getElementById('param-val-' + addedParamCount).value;
                requestDataStr[paramKey] = paramVal;
            }
        }
        requestDataStr = JSON.stringify(requestDataStr);
    }else if(contentType == 'json'){
        requestDataStr = document.getElementById('req-json').value;
    }

    if(requestType == 'get'){        
        fetch(url, {method: 'GET'}).then(response => response.text()).then((text) => {
            responseBox.innerHTML = text;
            Prism.highlightAll();
        });
    }else if(requestType == 'post'){
        fetch(url, {
            method: 'POST',
            body: requestDataStr,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then(response => response.text()).then((text) => {
            responseBox.innerHTML = text;
            Prism.highlightAll();
        });
    }
})