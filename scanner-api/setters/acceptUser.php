<?php
require_once('../connect_db.php');

if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {

  $name       = $_POST['name'];
  $dob        = $_POST['dob'];
  $idNum      = $_POST['idNum'];
  $gender     = $_POST['gender'];

  $sql               = "SELECT count(1) FROM `users` WHERE `users`.`id_number` = '".$idNum."'";
  $userExistCheck    = $database->multi_query($sql);
  if ($userExistCheck[0][0]['count(1)'] == "0") {
    // format dob correctly
    $oldDate = date_create($dob);
    $newDob = date_format($oldDate, 'Y-m-d');

    // format gender correctly
    $fullGender = ($gender == 'F') ? 'Female' : 'Male';
    
    // create a new entry to db
    $insertUserSql = "
      INSERT INTO `users`
        (`ID`, `name`, `date_of_birth`, `id_number`, `gender`, `checked_in`, `last_seen`) 
      VALUES 
        (NULL, '" . $name . "', '" . $newDob . "', '" . $idNum . "', '" . $fullGender . "', 1, now())
    ";
    $insertUserResult = $database->multi_query($insertUserSql);
    print_r(json_encode($insertUserSql));
  } else {
    // user is already in the database so we need to update last_seen status and set the checked_in status
    $updateUserSql = "UPDATE `users` SET `checked_in`=1,`last_seen`=now() WHERE id_number='" . $idNum . "'";
    $updateUserResult = $database->multi_query($updateUserSql);

    unlink('../files/id-image.bmp'); // remove image from server
    unlink('../files/new.csv'); // remove csv from server

    // end //

    print_r(json_encode($updateUserSql));
  }
}
$database->close_connection();