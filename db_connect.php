<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection settings
$servername = "localhost";
$username = "root"; // Change to your database username
$password = ""; // Change to your database password
$dbname = "gorsel_pinleme";

// Log connection attempt
error_log("Trying to connect to database: $dbname on $servername as $username");

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    sendResponse(false, "Database connection failed: " . $conn->connect_error, 500);
    exit();
}

// Log success
error_log("Database connection successful");

// Set charset to utf8
$conn->set_charset("utf8");

// Helper Functions
function sendResponse($status, $message, $code = 200, $data = null) {
    http_response_code($code);
    
    $response = [
        "reference" => uniqid(),
        "message" => $message,
        "code" => $code,
        "status" => $status
    ];
    
    if($data !== null) {
        $response["data"] = $data;
    }
    
    echo json_encode($response);
    exit();
}
?> 