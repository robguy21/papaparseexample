<?php

    require_once("database.php");
    
    date_default_timezone_set('Africa/Johannesburg');

    class MySQLDatabase {
      private $connection;
      public  $last_query;
      private $magic_quotes_active;
      private $real_escape_string_exists;
      
      function __construct() 
        {
            $this->open_connection();
      $this->magic_quotes_active = get_magic_quotes_gpc();
      $this->real_escape_string_exists = function_exists( "mysql_real_escape_string" );
        }
        public function open_connection() 
        {
            $this->connection = @mysqli_connect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
            mysqli_set_charset($this->connection,"UTF8");
            if (!$this->connection) 
            {
                die("Database connection failed: " . mysqli_error());
            } 
            else 
            {
                $db_select = mysqli_select_db($this->connection,DB_NAME);
                if (!$db_select) 
                {
                        die("Database selection failed: " . mysqli_error());
                }
            }
        }

        public function close_connection() 
        {
            if(isset($this->connection)) 
            {
                mysqli_close($this->connection);
                unset($this->connection);
            }
        }
         public function multi_query($sql) 
        {
            $returnvalues = [];
            $num = 0;
            if (mysqli_multi_query($this->connection,$sql)) 
            {
                do 
                {
                    if ($result = mysqli_store_result($this->connection)) 
                    {
                        $tempArray = [];
                        while ($row = mysqli_fetch_assoc($result))    
                        {
                            array_push($tempArray,$row);
                        }
                        $returnvalues[$num] = $tempArray;
                        $num ++;
                    }   
                } 
                while (mysqli_more_results($this->connection) && mysqli_next_result($this->connection));
            }
            return $returnvalues;
        }
      
        public function escape_value( $value ) 
        {
            if( $this->real_escape_string_exists ) 
            { // PHP v4.3.0 or higher
                    // undo any magic quote effects so mysql_real_escape_string can do the work
                if( $this->magic_quotes_active ) 
                { 
                    $value = stripslashes( $value ); 
                }
                $value = mysql_real_escape_string( $value );
            } 
            else 
            { // before PHP v4.3.0
                // if magic quotes aren't already on then add slashes manually
                if( !$this->magic_quotes_active ) { $value = addslashes( $value ); }
                // if magic quotes are active, then the slashes already exist
            }
            return $value;
        }
      
      // "database-neutral" methods
      public function fetch_array($result_set) {
        return mysqli_fetch_array($result_set);
      }
      
      public function num_rows($result_set) {
       return mysqli_num_rows($result_set);
      }
      
      public function insert_id() {
        // get the last id inserted over the current db connection
        return mysqli_insert_id($this->connection);
      }
      
      public function affected_rows() {
        return mysqli_affected_rows($this->connection);
      }

      private function confirm_query($result) {
        if (!$result) {
          $output = "Database query failed: " . mysql_error() . "<br /><br />";
          //$output .= "Last SQL query: " . $this->last_query;
          die( $output );
        }
      }
      
      public function unique_id($length) {
        $key = '';
        $keys = array_merge(range(0, 9), range('a', 'z'));

        for ($i = 0; $i < $length; $i++) {
          $key .= $keys[array_rand($keys)];
        }

        return $key;  
      }
    }
    $database = new MySQLDatabase();
    $db = $database;

