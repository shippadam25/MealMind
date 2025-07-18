<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Debug: Script started\n";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

echo json_encode(["debug" => "headers set", "method" => $_SERVER['REQUEST_METHOD']]);
?>
