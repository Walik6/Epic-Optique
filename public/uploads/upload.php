<?php
// upload.php
$targetDir = "uploads/";
$targetFile = $targetDir . basename($_FILES["image"]["name"]);

if(move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
    echo json_encode(["success" => true, "url" => $targetFile]);
} else {
    echo json_encode(["success" => false]);
}
?>
