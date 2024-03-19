window.onload = function() {
    loadRecordsFromCookies();
};

function addRecord() {
    var filename = document.getElementById("filename").value.trim();
    var fileformat = document.getElementById("fileformat").value;
    var url = document.getElementById("url").value.trim();

    if (filename === "" || url === "") {
        alert("Please fill in all fields.");
        return;
    }

    var record = filename + " - Free Download By @PandaWep in Telegram" + fileformat;
    var recordWithUrl = url;

    var table = document.getElementById("records").getElementsByTagName('tbody')[0];
    var row = table.insertRow(-1);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    cell0.appendChild(checkbox);
    cell1.textContent = table.rows.length - 1;
    cell2.innerHTML = record;
    cell3.innerHTML = recordWithUrl;
    cell4.innerHTML = "<button class='copy-button' onclick='copyLine(this.parentNode.parentNode, 2)'>Copy FILE NAME</button>" +
        "<button class='copy-button' onclick='copyLine(this.parentNode.parentNode, 3)'>Copy URL</button>" +
        "<button class='edit-button' onclick='editRow(this.parentNode.parentNode)'>Edit</button>" +
        "<button class='delete-button' onclick='deleteRow(this.parentNode.parentNode)'>Delete</button>";

    document.getElementById("filename").value = ""; // Clear Filename input
    document.getElementById("url").value = ""; // Clear URL input
    saveRecordsToCookies();
}

// Function to copy the file name
function copyFileName(row) {
    var fileName = row.cells[2].textContent.trim();
    navigator.clipboard.writeText(fileName).then(function() {
        alert("File name copied to clipboard!");
    }, function() {
        alert("Failed to copy file name to clipboard.");
    });
}

// Function to copy the URL
function copyFileUrl(row) {
    var fileUrl = row.cells[3].textContent.trim();
    navigator.clipboard.writeText(fileUrl).then(function() {
        alert("File URL copied to clipboard!");
    }, function() {
        alert("Failed to copy file URL to clipboard.");
    });
}


function deleteRow(row) {
    row.parentNode.removeChild(row);
    updateRowNumbers();
    saveRecordsToCookies();
}

function updateRowNumbers() {
    var table = document.getElementById("records");
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[1].textContent = i;
    }
}


  function downloadTable() {
    var table = document.getElementById("records");
    var data = [];
    for (var i = 1; i < table.rows.length; i++) {
      var row = table.rows[i];
      var record1 = row.cells[2].textContent.trim();
      var record2 = row.cells[3].textContent.trim();
      data.push({ "FILE NAME": record1, "URL": record2 });
    }
    var jsonData = JSON.stringify(data, null, 2);
    var blob = new Blob([jsonData], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "file_records.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleFileUpload(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      var contents = event.target.result;
      var data = JSON.parse(contents);
      data.forEach(function(record) {
        addRecordFromJson(record);
      });
    };
    reader.readAsText(file);
  }

  function addRecordFromJson(record) {
    var table = document.getElementById("records").getElementsByTagName('tbody')[0];
    var row = table.insertRow(-1);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    cell0.appendChild(checkbox);
    cell1.textContent = table.rows.length - 1;
    cell2.textContent = record["FILE NAME"];
    cell3.textContent = record["URL"];
    cell4.innerHTML = "<button class='copy-button' onclick='copyFileName(this.parentNode.parentNode)'>Copy FILE NAME</button>" +
                        "<button class='copy-button' onclick='copyFileUrl(this.parentNode.parentNode)'>Copy URL</button>" +
                        "<button class='edit-button' onclick='editRow(this.parentNode.parentNode)'>Edit</button>" +
                         "<button class='delete-button' onclick='deleteRow(this.parentNode.parentNode)'>Delete</button>";
  }

  function editRow(row) {
    var cells = row.cells;
    var line1 = cells[2].textContent.trim();
    var line2 = cells[3].textContent.trim();
    document.getElementById("filename").value = line1.split(" by pandawep.in ")[0];
    document.getElementById("fileformat").value = line1.split(" by pandawep.in ")[1];
    document.getElementById("url").value = line2;

    var updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.className = "update-button";
    updateButton.onclick = function() {
      updateRecord(row);
    };

    var actionsCell = cells[4];
    actionsCell.innerHTML = "";
    actionsCell.appendChild(updateButton);
  }

  function updateRecord(row) {
    var filename = document.getElementById("filename").value.trim();
    var fileformat = document.getElementById("fileformat").value;
    var url = document.getElementById("url").value.trim();

    if (filename === "" || url === "") {
      alert("Please fill in all fields.");
      return;
    }

    var record = "'" + filename + " by pandawep.in " + fileformat + "'";
    var recordWithUrl = url;

    var cells = row.cells;
    cells[2].innerHTML = record;
    cells[3].innerHTML = recordWithUrl;

    var editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.onclick = function() {
      editRow(row);
    };

    var actionsCell = cells[4];
    actionsCell.innerHTML = "";
    actionsCell.appendChild(editButton);
    actionsCell.innerHTML += "<button class='copy-button' onclick='copyLine(this.parentNode.parentNode, 3)'>Copy FILE NAME</button>" +
                            "<button class='copy-button' onclick='copyLine(this.parentNode.parentNode, )'>Copy URL</button>" +
                            "<button class='delete-button' onclick='deleteRow(this.parentNode.parentNode)'>Delete</button>";

    document.getElementById("filename").value = ""; // Clear Filename input
    document.getElementById("url").value = ""; // Clear URL input
    saveRecordsToCookies();
  }

  function saveRecordsToCookies() {
    var table = document.getElementById("records");
    var data = [];
    for (var i = 1; i < table.rows.length; i++) {
      var row = table.rows[i];
      var record1 = row.cells[2].textContent.trim();
      var record2 = row.cells[3].textContent.trim();
      data.push({ "FILE NAME": record1, "URL": record2 });
    }
    document.cookie = "fileRecords=" + JSON.stringify(data) + "; path=/";
  }

  function loadRecordsFromCookies() {
    var cookies = document.cookie.split(';');
    var recordsCookie = cookies.find(cookie => cookie.trim().startsWith('fileRecords='));
    if (recordsCookie) {
      var data = JSON.parse(recordsCookie.split('=')[1]);
      data.forEach(function(record) {
        addRecordFromJson(record);
      });
    }
  }

  function deleteSelectedRows() {
    var table = document.getElementById("records").getElementsByTagName('tbody')[0];
    var checkboxes = table.querySelectorAll('input[type="checkbox"]');
    for (var i = checkboxes.length - 1; i >= 0; i--) {
      if (checkboxes[i].checked) {
        table.deleteRow(i + 1); // Offset by 1 for header row
      }
    }
    updateRowNumbers();
    saveRecordsToCookies();
  }

  function deleteAllRows() {
    var table = document.getElementById("records").getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    saveRecordsToCookies();
  }
