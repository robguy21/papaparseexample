<?php
   error_reporting(E_ALL);
   ini_set("display_errors", 1);

    if (isset($_SERVER['HTTP_ORIGIN'])) {
           header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
           header('Access-Control-Allow-Credentials: true');
           header('Access-Control-Max-Age: 86400');    // cache for 1 day
           header('Content-Type: application/json');
           header('Access-Control-Allow-Headers: Content-Type');
   }
   
   define('DB_TYPE', 'mysql');
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'scanner');
   define('DB_USER', 'root');
   define('DB_PASS', 'ross');
