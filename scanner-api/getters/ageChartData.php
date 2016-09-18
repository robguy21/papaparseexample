<?php

require_once($_SERVER['DOCUMENT_ROOT'].'/scanner-api/connect_db.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $ageRange = $_POST['ageRange'];
  $genderChoice = $_POST['gender'];
  $minAge = explode("-", $ageRange)[0];
  $maxAge = explode("-", $ageRange)[1];
  $data = $database->multi_query("SELECT `date_of_birth` FROM `users` WHERE `checked_in` = 1 AND `gender`='" . $genderChoice . "'");
  $now = new DateTime();

  $matchCounter = 0;
  $total = count($data[0]);

  if (isset($data[0][0])) {
    foreach ($data[0] as $key => $value) {
      $date = new DateTime($value['date_of_birth']);
      $age = $now->diff($date)->y;

      if ($age > $minAge && $age < $maxAge) {
        $matchCounter++;
      }
    }
  } else {
    $matchCounter = 0;
    $total = 0;
  }

  print_r(json_encode([['Count', $matchCounter], ['Total', $total]]));
}

$database->close_connection();
