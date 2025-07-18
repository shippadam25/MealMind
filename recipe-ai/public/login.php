<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

session_start();


// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Invalid request method");
}

// Check if required fields are present
if (empty($_POST['email']) || empty($_POST['password'])) {
    die("Email and password are required");
}

// Database connection
$mysqli = new mysqli("localhost", "root", "", "usersdb");
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$email = trim($_POST['email']);
$password = $_POST['password'];

// Query using email column
$stmt = $mysqli->prepare("SELECT id_user, username, password FROM user WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 1) {
    $stmt->bind_result($user_id, $username, $hashed_password);
    $stmt->fetch();

    if (password_verify($password, $hashed_password)) {
    $_SESSION['user_id'] = $user_id;
    $_SESSION['username'] = $username;
    $_SESSION['email'] = $email;
    $_SESSION['logged_in'] = true;

    // Return JSON response
    echo json_encode([
        "status" => "success",
        "username" => $username
    ]);
    exit();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Incorrect password."
    ]);
}
 else {
    echo json_encode([
    "status" => "error",
    "message" => "Email not found."
]);
}

$stmt->close();
$mysqli->close();
?>
