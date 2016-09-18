<?php

require_once($_SERVER['DOCUMENT_ROOT'].'/scanner-api/connect_db.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $data = $database->multi_query("SELECT count(*) as count FROM `users` WHERE `checked_in` = 1");
  $returnArr = [];

  if (isset($data[0][0])) {
    $returnArr[] = ['Now In', (int) $data[0][0]['count'][0]];
    $returnArr[] = ['Capacity', (100 - (int) $data[0][0]['count'][0])];
  } else {
    // $returnArr[] = ['100', 0];

  }

  print_r(json_encode($returnArr));
}

$database->close_connection();
