<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Include token validation
require_once 'validate_token.php';

// User should be authenticated by now and $current_user is available

// Get POST data
$name = isset($_POST['name']) ? trim($_POST['name']) : $current_user['name'];
$profile_image = isset($_POST['profile_image']) ? trim($_POST['profile_image']) : null;

// Update user data
$updateFields = [];
$updateTypes = "";
$updateValues = [];

// Always update name
$updateFields[] = "name = ?";
$updateTypes .= "s";
$updateValues[] = $name;

// Only update profile image if provided
if ($profile_image !== null) {
    $updateFields[] = "profile_image = ?";
    $updateTypes .= "s";
    $updateValues[] = $profile_image;
}

// Add user ID at the end of values array
$updateTypes .= "i";
$updateValues[] = $current_user['id'];

// Create update query
$sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);

// Dynamically bind parameters
$stmt->bind_param($updateTypes, ...$updateValues);

if ($stmt->execute()) {
    // Get updated user data
    $stmt->close();
    
    $stmt = $conn->prepare("SELECT id, name, email, profile_image, created_at FROM users WHERE id = ?");
    $stmt->bind_param("i", $current_user['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $updatedUser = $result->fetch_assoc();
    
    sendResponse(true, "Profile updated successfully", 200, [
        "user" => $updatedUser
    ]);
} else {
    sendResponse(false, "Failed to update profile: " . $conn->error, 500);
}

$stmt->close();
$conn->close();
?> 