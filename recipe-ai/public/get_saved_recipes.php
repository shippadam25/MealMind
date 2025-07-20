<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }
header('Content-Type: application/json');
session_start();

$username = $_GET['username'] ?? '';
if (!$username) {
    echo json_encode(['status'=>'error', 'message'=>'Username required']);
    exit();
}

$mysqli = new mysqli("localhost", "root", "", "usersdb");
if ($mysqli->connect_error) {
    echo json_encode(['status'=>'error', 'message'=>'DB connection failed']);
    exit();
}

// Get user id
$stmt = $mysqli->prepare("SELECT id_user FROM user WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($user_id);
if (!$stmt->fetch()) {
    echo json_encode(['status'=>'error', 'message'=>'User not found']);
    exit();
}
$stmt->close();

// Get recipes
$stmt = $mysqli->prepare("SELECT recipe_text, image_url, grocery_list, created_at FROM recipes WHERE user_id=? ORDER BY created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$recipes = [];
while ($row = $result->fetch_assoc()) {
    $recipes[] = $row;
}
$stmt->close();
$mysqli->close();

echo json_encode(['status'=>'success', 'recipes'=>$recipes]);
?>
