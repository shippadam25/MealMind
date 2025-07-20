<?php
header("Access-Control-Allow-Origin: http://localhost:5500");  // use exact origin of your frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");  // allow cookies/session
header('Content-Type: application/json');

// Set session cookie parameters BEFORE session_start()
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',      // usually blank for localhost
    'secure' => false,   // false for local HTTP, true if using HTTPS
    'httponly' => true,
    'samesite' => 'Lax'  // 'Lax' is good for most cases, 'None' requires 'secure' true
]);

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}


// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit();
}

// Check required fields
if (empty($_POST['email']) || empty($_POST['password'])) {
    echo json_encode(["status" => "error", "message" => "Email and password are required"]);
    exit();
}

// DB connection
$mysqli = new mysqli("localhost", "root", "", "usersdb");
if ($mysqli->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $mysqli->connect_error]);
    exit();
}

$email = trim($_POST['email']);
$password = $_POST['password'];

// Prepare and execute query
$stmt = $mysqli->prepare("SELECT id_user, username, password FROM user WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 1) {
    $stmt->bind_result($user_id, $username, $hashed_password);
    $stmt->fetch();

    if (password_verify($password, $hashed_password)) {
        // Set session variables
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;
        $_SESSION['logged_in'] = true;

        echo json_encode([
            "status" => "success",
            "username" => $username
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Incorrect password."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Email not found."
    ]);
}

$stmt->close();
$mysqli->close();
?>
