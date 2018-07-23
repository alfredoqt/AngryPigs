<?php
/** ===============================================================================================
 * AJAX Action handler class
 * @author: Scott Henshawe
 * @copyright: 2015 Kibble Games Inc, in cooperation with VFS
 *
 */

// include('ajax_server.php');   // If you want to modify the ajax server and subclass from it

class Server /* extends ajax_server */ {

    private $debug_mode = TRUE;


    public function __construct() {

        if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists

            $action = $_POST["action"];   // Get the action requested, make these up as needed

            switch( $action ) {     //Switch case for value of action
                case "get_level_list":
                    $response = $this->do_get_level_list( $_POST );
                    break;
                case "load_level":
                    $response = $this->do_load_level( $_POST );
                    break;
                case "save_level":
                    $response = $this->do_save_level( $_POST );
                    break;
                default:
                    $response = $this->is_error( "Error: 101 - Invalid action." );
                    break;
            }

            echo json_encode( $response );

            return 0;
        }
    }


    private function is_ajax() {

        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }


    /*
     * When we encounter an error the handler should call is error with a message and hand that back
     * as a response to the client
     */
    private function is_error( $error_msg ) {

        // Create a response array (attrib => value) with the origingal post params to start
        $response = $_POST;

        // Add our error message
        $response["error"] = $error_msg;

        // convert the whole response to a JSON string, then add that string
        // as another element to the return message
        //
        // This lets us see the data coming back as a string in the debugger
        if ($this->debug_mode) {

            $response["json"] = json_encode( $response );
        }

        // Respond to the client with a JSON string containing attrib => value pairs encoded
        return $response;
    }

    private function do_get_level_list( $request ) {
        $response = [];

        $folder = "./data/levels/";

        // List all file names
        $levelList = glob($folder . "*.json");

        $response = array();

        // Substrings to remove from the levels
        $substringsToRemove = array($folder, ".json");

        for ($i = 0; $i < count($levelList); $i++) {
            // Process the string
            $levelName = str_replace($substringsToRemove, "", $levelList[$i]);
            array_push($response, $levelName);
        }

        return $response;
    }

    private function do_load_level( $request ) {
        // Get the level with the name
        $file = file_get_contents('./data/levels/' . $request["level-to-load"] . '.json', true);
        return json_decode($file);
    }

    private function do_save_level( $request ) {
        // Write the level contents to a file
        file_put_contents( './data/levels/' . $request["file"] . '.json', $request["level"] );

        return array();
    }
}


// ========================================================================
//
// MAIN Handler to process POST requests
//
$ajax_post_handler = new Server;
?>
