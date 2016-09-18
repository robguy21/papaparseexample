<?php

require_once($_SERVER['DOCUMENT_ROOT'].'/scanner-api/connect_db.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $data = $database->multi_query("SELECT count(*) as count, gender FROM `users` WHERE `checked_in` = 1 GROUP BY gender");
  $returnArr = [];

  foreach ($data[0] as $key => $value) {
    $thisArr = [$value['gender'], (int) $value['count'][0]];
    $returnArr[] = $thisArr;
  }

  print_r(json_encode($returnArr));
}

$database->close_connection();
