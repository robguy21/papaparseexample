(function() {
  var SCANNER_API = 'http://localhost/scanner/scanner-api/';
  // set up our clear all button actions 
  var myData;

  var clearBtn = document.getElementById('js-clear-data');
  var readNewBtn = document.getElementById('js-read-data');

  // Action Button Listeners
  var acceptBtn = document.getElementById('js-data-action-accept');
  var denyBtn = document.getElementById('js-data-action-deny');

  // toggle the state of the page overlay
  function toggleOverlay() {
    return;
    // var overlay = document.getElementsByClassName('overlay-container')[0];
    // if (overlay.classList.contains('closed')) {
    //   overlay.classList.remove('closed');
    // } else {
    //   overlay.classList.add('closed');
    // }
  }

  function toggleTextOnReadNewButton(text) {
  if (text !== undefined) {
    readNewBtn.innerHTML = text;
  } else if(readNewBtn.innerHTML == 'Scan ID') {
      readNewBtn.innerHTML = 'No ID Found';
    } else {
      readNewBtn.innerHTML = 'Scan ID';
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
      data: {
        'idNum': myId.innerHTML,
      }
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
  
    $.ajax({
      type: 'GET',
      url: SCANNER_API + 'getters/getLatestCsv.php',
      dataType: 'json',
    })
    .done(function(result) {
    var csvfile = "scanner-api/files/" + result[0];
    var imageSrc = "scanner-api/files/" + result[1];
    var imageHook = document.getElementById("js-image-hook");
    imageHook.innerHTML = "";
    imageHook.innerHTML = "<img src='" + imageSrc + "' />";
      $.get(csvfile, function (data) { // since jquery is here... use it to get the file contents

      parseLocalFile(data, completeCallback)
  });

    })
    .fail(function(error) {
    toggleTextOnReadNewButton('No ID Found');
      console.log(error);
    })
    .always(function(response) {
      console.log('here');
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
        myTime = document.getElementById('js-data-time'),
        sbName = document.getElementById('js-sidebar-name'),
        sbAge = document.getElementById('js-sidebar-age'),
        sbGender = document.getElementById('js-sidebar-gender');

    myName.innerHTML = dataObj.First_names + " " + dataObj.Surname;
    myId.innerHTML = dataObj.ID;
    myGender.innerHTML = dataObj.Sex === "M" ? "Male" : "Female";
    myTime.innerHTML = moment().format("DD-MM-YYYY hh:ss");

    sbName.innerHTML = dataObj.First_names + " " + dataObj.Surname;

    var genderImgSrc = "http://scanner.sites.dev/assets/images/" + (dataObj.Sex === "M") ? "male.jpg" : "female.jpg";

    sbGender.innerHTML = '<img src="' + genderImgSrc + '" />';

    var ageDiff = moment().diff(dataObj.Date_of_birth, 'years');
    var ageDiffText = (ageDiff >= 18) ? 'clear' : 'bait';

    sbAge.innerHTML = '<span class="age-bgc-' + ageDiffText + '">' + ageDiff + '</span>';

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
