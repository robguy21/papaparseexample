<?php

require_once($_SERVER['DOCUMENT_ROOT'].'/scanner-api/connect_db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $data = $database->multi_query("SELECT `date_of_birth` FROM `users` WHERE `checked_in` = 1");
  $returnArr = [];

  $ageArr = [];
  $now = new DateTime();

  if (isset($data[0][0])) {
    foreach ($data[0] as $value) {
      $date = new DateTime($value['date_of_birth']);
      $age[] = $now->diff($date)->y;
    }

    $returnArr = [
      'total' => count($age),
      'average' => (array_sum($age) / count($age))
    ];

  } else {
    $returnArr = [
      'total' => 0,
      'average' => 0
    ];
  }

  print_r(json_encode($returnArr));
}

$database->close_connection();