(function() {
  var SCANNER_API = 'http://scanner-api.sites.dev/';
  // set up our clear all button actions 
  var myData;

  var clearBtn = document.getElementById('js-clear-data');
  var readNewBtn = document.getElementById('js-read-data');

  // Action Button Listeners
  var acceptBtn = document.getElementById('js-data-action-accept');
  var denyBtn = document.getElementById('js-data-action-deny');

  // toggle the state of the page overlay
  function toggleOverlay() {
    var overlay = document.getElementsByClassName('overlay-container')[0];
    if (overlay.classList.contains('closed')) {
      overlay.classList.remove('closed');
    } else {
      overlay.classList.add('closed');
    }
  }

  function toggleTextOnReadNewButton() {
    if(readNewBtn.innerHTML == 'Scan for Data') {
      readNewBtn.innerHTML = 'loading...';
    } else {
      readNewBtn.innerHTML = 'Scan for Data';
    }
  }

  function setSucces(userName) {
    var successElem = document.getElementById('js-success');
    successElem.innerHTML = '<span>' + userName + " allowed entrance." + '</span>';
  }
  function setReject(userName) {
    var successElem = document.getElementById('js-success');
    successElem.innerHTML = '<span>' + userName + " denied entrance." + '</span>';
  }

  function clear() {
    var myName = document.getElementById('js-data-name'),
        myId = document.getElementById('js-data-id-number'),
        myGender = document.getElementById('js-data-gender'),
        myTime = document.getElementById('js-data-time');
    $.ajax({
      type: 'POST',
      url: SCANNER_API + 'setters/rejectUser.php',
      dataType: 'json',
    })
    .done(function(result) {
      setReject(myData.First_names + " " + myData.Surname);
      toggleOverlay();
      setTimeout(function() {
        myName.innerHTML = "";
        myId.innerHTML = "";
        myGender.innerHTML = "";
        myTime.innerHTML = "";
      }, 350)
    })
    return true;
  }

  clearBtn.addEventListener('click', clear, false);

  // end //
  
  // Now our read new file button

  function readNew() {
    toggleTextOnReadNewButton();
    var csvfile = "scanner-api/files/new.csv"; // we need to have a relative path reference to the file

    $.get(csvfile, function (data) { // since jquery is here... use it to get the file contents
      parseLocalFile(data, completeCallback)
    });

  }

  readNewBtn.addEventListener('click', readNew, false);

  // end //


  // Action Button Listeners
  var acceptBtn = document.getElementById('js-data-action-accept');
  var denyBtn = document.getElementById('js-data-action-deny');

  function acceptUser () {
    // make post request to api to insert a user into the db
    console.log(myData);
    $.ajax({
      type: 'POST',
      url: SCANNER_API + 'setters/acceptUser.php',
      dataType: 'json',
      data: {
        'name': myData.First_names + " " + myData.Surname,
        'dob': myData.Date_of_birth,
        'idNum': myData.ID,
        'gender': myData.Sex,
      },
    })
    .done(function(result) {
      console.log(result);
      // successful
      var name = myData.First_names + " " + myData.Surname;
      setSucces(name);
      toggleOverlay();
    })
    .fail(function(error) {
      console.log(error);
    })
    .always(function(response) {
      console.log('here');
    });
  }

  acceptBtn.addEventListener('click', acceptUser, false);

  // end //


  var PAPAFIG = { // our papa parse config
    delimiter: "",  // auto-detect
    newline: "",  // auto-detect
    header: true,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: undefined,
    complete: function(results) {
      // executed after all files are complete
      completeCallback(results);
    },
    error: function(errors) {
      handleErrors(errors);
    },
    download: false,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined 
  }; 

  function completeCallback (result) { // this function will handle a successful result
    // console.log(result);
    myData = result.data[0]; // assign global my data to data
    populatePageWithData(result.data[0], toggleOverlay, toggleTextOnReadNewButton);

  };

  function populatePageWithData(dataObj, completeFn, completeFn2) {
    var myName = document.getElementById('js-data-name'),
        myId = document.getElementById('js-data-id-number'),
        myGender = document.getElementById('js-data-gender'),
        myTime = document.getElementById('js-data-time');
    myName.innerHTML = dataObj.First_names + " " + dataObj.Surname;
    myId.innerHTML = dataObj.ID;
    myGender.innerHTML = dataObj.Sex === "M" ? "Male" : "Female";
    myTime.innerHTML = "2009-09-03 19:39:00";

    completeFn();
    completeFn2();
  }

  function handleErrors (errors) { // this function will handle a failure in the parsing
    var error = document.getElementById('js-error-container');
    error.innerHTML = errors;
  };

  // parse a local file...
  function parseLocalFile (file, callBack) {
    console.log(typeof file);
    Papa.parse(file, PAPAFIG);
  };
})();
