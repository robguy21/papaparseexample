<?php

require_once('../connect_db.php');
// echo "hello";
if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {

  unlink('../files/id-image.bmp'); // remove image from server
  unlink('../files/new.csv'); // remove csv from server

  print_r(json_encode('true'));
}