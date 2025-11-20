<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once 'db_connect.php';

// Get POST data
$email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Debug log
error_log("Login attempt: " . $email);

// Validate data
if(empty($email) || empty($password)) {
    sendResponse(false, "Email and password are required", 400);
    exit();
}

// Prepare and execute select statement
$stmt = $conn->prepare("SELECT id, name, email, password, profile_image FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows === 0) {
    sendResponse(false, "Invalid email or password", 401);
    exit();
}

$user = $result->fetch_assoc();

// Verify password
if(!password_verify($password, $user['password'])) {
    sendResponse(false, "Invalid email or password", 401);
    exit();
}

// Remove password from user data
unset($user['password']);

// Generate auth token
$token = generateToken($user['id']);

// Return success response with token and user data
sendResponse(true, "Login successful", 200, [
    "token" => $token,
    "user" => $user
]);

$stmt->close();
$conn->close();

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

function generateToken($user_id) {
    // Simple token generation, in a production app you would use JWT
    $tokenData = [
        "user_id" => $user_id,
        "created" => time()
    ];
    
    return base64_encode(json_encode($tokenData));
}
?> 