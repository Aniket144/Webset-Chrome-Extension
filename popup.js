window.onload = init;
var addButton;  // The WebSet Add Button.
var textArea;   // The textArea for Links of the tabs.
var saveButton;
var content;
var showButton;
var websets;
var loadButton;
var websetName;

function init(){
  textArea = document.getElementById("url-list");
  addButton = document.getElementById("addButton");
  addButton.onclick = createWebset;
  saveButton = document.getElementById("saveButton");
  saveButton.onclick = saveWebset;
  websets = document.getElementById("websets");
  websetName = document.getElementById("websetName");
  makeLI();
}
function createWebset(){
  textArea.style.visibility = 'visible';
  saveButton.style.visibility = 'visible';
  websetName.style.visibility = 'visible';
  textArea.style.height = '300px';
  onLoad(); // Getting the links in TextArea.
}

function list(tabs) {
  contents = '';
  for (var i = 0; i < tabs.length; i++) {
    contents += tabs[i].url + '\n';
  }
  document.getElementById('url-list').innerHTML = contents;
}

function onLoad() {
  chrome.tabs.getAllInWindow(null, list);
}

function saveWebset(){
  var t_name = websetName.value;
  if(t_name.length==0){
    alert("Enter the name !");
    return;
  }
  else{
    if(checkName(t_name)){
      alert("Webset of that name already exists, Try another!");
      return;
    }
  }
  console.log("Key = "+t_name+" & Contents="+contents);
  localStorage.setItem(t_name,contents);
  location.reload();
}

function checkName(name){
  console.log("Name to check = "+name);
  if(localStorage.getItem(name)==null) return false;
  else return true;
}

function funt(){
  alert("Do nothing");
}

function showWebset(){
  var key = websetName.value;
  chrome.storage.local.get(key,function(data){
    alert(data);
  });
}

function loadSites(e) {
	var urlschemes = ['http', 'https', 'file', 'view-source'];
	var urls = document.getElementById('url-list').value.split('\n');
	for(var i=0; i<urls.length; i++){
		theurl = urls[i].trim();
		if(theurl != '') {
			if(urlschemes.indexOf(theurl.split(':')[0]) == -1) {
				theurl = 'http://' + theurl;
			}
			chrome.tabs.create({url: theurl, selected: false});
		}
	}
}

function makeLI(){
  console.log("LS len = "+localStorage.length);
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    console.log(value);

    var list = document.createElement('li');
    list.setAttribute("id",key);
    //websets.appendChild(list);
    list.innerHTML = key;

    var openButton = document.createElement('button');
    openButton.onclick = function() {openTabs(this.parentNode)};
    var delButton = document.createElement('button');
    delButton.onclick = function() {delTabs(this.parentNode)};

    openButton.innerHTML = "Open";
    delButton.innerHTML = "Delete";

    openButton.setAttribute("class","button2");
    delButton.setAttribute("class","button2");

    list.appendChild(delButton);
    list.appendChild(openButton);

    websets.appendChild(list);
  }
}

function openTabs(parent){
  console.log("Open Tabs Function Called");
  var key = parent.getAttribute('id');
  console.log("key = "+key);
  var value = localStorage.getItem(key);
  textArea.innerHTML = value;
  loadSites();
  console.log("value = "+value+"  value's length="+value.length);
}

function delTabs(parent){
  console.log("Del Tabs Function Called");
  var key = parent.getAttribute('id');
  console.log("key = "+key);
  localStorage.removeItem(key);
  location.reload();
}
