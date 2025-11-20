<?php
/**
 * Token validation script for protected API endpoints
 * Include this file at the beginning of any endpoint that requires authentication
 */

// Function to get authorization header
function getAuthorizationHeader() {
    $headers = null;
    
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    
    return $headers;
}

// Function to get bearer token
function getBearerToken() {
    $headers = getAuthorizationHeader();
    
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    
    // Check if token is in POST or GET parameters
    if (isset($_POST['token'])) {
        return $_POST['token'];
    } else if (isset($_GET['token'])) {
        return $_GET['token'];
    }
    
    return null;
}

// Include database connection
require_once 'db_connect.php';

// Get token
$token = getBearerToken();

if (!$token) {
    sendResponse(false, "Unauthorized: No token provided", 401);
    exit();
}

// Validate token (basic validation - in production use JWT or similar)
try {
    $tokenData = json_decode(base64_decode($token), true);
    
    if (!isset($tokenData['user_id']) || !isset($tokenData['created'])) {
        sendResponse(false, "Unauthorized: Invalid token format", 401);
        exit();
    }
    
    $userId = $tokenData['user_id'];
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        sendResponse(false, "Unauthorized: User not found", 401);
        exit();
    }
    
    // Token is valid, set global user variable for the endpoint to use
    $GLOBALS['current_user'] = $result->fetch_assoc();
    
    // Close statement
    $stmt->close();
    
} catch (Exception $e) {
    sendResponse(false, "Unauthorized: Invalid token", 401);
    exit();
}

// If execution reaches here, token is valid and current_user is set
?>