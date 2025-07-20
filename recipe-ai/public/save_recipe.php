<?php
header("Access-Control-Allow-Origin: http://localhost:5500"); // allow your frontend origin
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }
header('Content-Type: application/json');

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',      // blank for localhost
    'secure' => false,   // false for local HTTP, true if HTTPS
    'httponly' => true,
    'samesite' => 'Lax'  // good default
]);

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['username'], $input['recipe'], $input['imageUrl'], $input['groceryList'])) {
    echo json_encode(['status'=>'error', 'message'=>'Missing data']);
    exit();
}

$username = $input['username'];
$recipe = $input['recipe'];
$imageUrl = $input['imageUrl'];
$groceryList = $input['groceryList'];

$mysqli = new mysqli("localhost", "root", "", "usersdb");
if ($mysqli->connect_error) {
    echo json_encode(['status'=>'error', 'message'=>'DB connection failed']);
    exit();
}

// Find user id from username
$stmt = $mysqli->prepare("SELECT id_user FROM user WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($user_id);
if (!$stmt->fetch()) {
    echo json_encode(['status'=>'error', 'message'=>'User not found']);
    exit();
}
$stmt->close();

// Insert recipe
$stmt = $mysqli->prepare("INSERT INTO recipes (user_id, recipe_text, image_url, grocery_list) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $user_id, $recipe, $imageUrl, $groceryList);
if ($stmt->execute()) {
    echo json_encode(['status'=>'success', 'message'=>'Recipe saved']);
} else {
    echo json_encode(['status'=>'error', 'message'=>'Failed to save recipe']);
}
$stmt->close();
$mysqli->close();
?>
