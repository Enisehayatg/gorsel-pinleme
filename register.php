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
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Validate data
if(empty($name) || empty($email) || empty($password)) {
    sendResponse(false, "All fields are required", 400);
    exit();
}

// Validate email format
if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, "Invalid email format", 400);
    exit();
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows > 0) {
    sendResponse(false, "Email already registered", 409);
    exit();
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Prepare and execute insert statement
$stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())");
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if($stmt->execute()) {
    // Get the newly inserted user's ID
    $user_id = $stmt->insert_id;
    
    // Generate token for authentication
    $token = generateToken($user_id);
    
    // Get user data without password
    $user = getUserById($conn, $user_id);
    
    // Return success response with token and user data
    sendResponse(true, "Registration successful", 201, [
        "token" => $token,
        "user" => $user
    ]);
} else {
    sendResponse(false, "Registration failed: " . $conn->error, 500);
}

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

function getUserById($conn, $user_id) {
    $stmt = $conn->prepare("SELECT id, name, email, profile_image, created_at FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        return $user;
    }
    
    return null;
}
?> 