<?php
require_once('../connect_db.php');

if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {

  $idNum      = $_POST['idNum'];

  $sql               = "SELECT count(1) FROM `users` WHERE `users`.`id_number` = '".$idNum."'";
  $getUser           = $database->multi_query($sql);

    // user is already in the database so we need to update last_seen status and set the checked_in status
    $updateUserSql = "UPDATE `users` SET `checked_in`=0,`last_seen`=now() WHERE id_number='" . $idNum . "'";
    $updateUserResult = $database->multi_query($updateUserSql);

    unlink('../files/id-image.bmp'); // remove image from server
    unlink('../files/new.csv'); // remove csv from server

    // end //

    print_r(json_encode($updateUserSql));
  }
}
$database->close_connection();