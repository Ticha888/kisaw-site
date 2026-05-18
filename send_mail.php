<?php
// send_mail.php

header('Content-Type: application/json; charset=utf-8');

// Configuration
$to = 'hello@kisaw.studio';
// It's generally best practice to use a generic 'from' address on your domain
// to ensure it doesn't fail SPF/DKIM checks on the server.
$from = 'noreply@kisaw.studio'; 
$subject = isset($_POST['_subject']) ? $_POST['_subject'] : 'New Signal from Kisaw Studio!';

// Basic fields
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message_text = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($name) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Name and Email are required.']);
    exit;
}

// Ensure valid email format for reply-to
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

$replyTo = $email;

// Boundary for multipart email
$boundary = md5(time() . rand());

// Headers
$headers = "From: $from\r\n";
$headers .= "Reply-To: $replyTo\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

// Body Content (HTML or Plain Text)
$body = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";

$body .= "You have received a new message from your website.\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Message:\n$message_text\n\n";

// Handle Attachments
// If multiple files are sent as attachment[]
if (isset($_FILES['attachment']) && is_array($_FILES['attachment']['error'])) {
    $file_count = count($_FILES['attachment']['error']);
    for ($i = 0; $i < $file_count; $i++) {
        if ($_FILES['attachment']['error'][$i] === UPLOAD_ERR_OK) {
            $file_tmp = $_FILES['attachment']['tmp_name'][$i];
            $file_name = $_FILES['attachment']['name'][$i];
            $file_type = $_FILES['attachment']['type'][$i];
            
            if (is_uploaded_file($file_tmp)) {
                $content = file_get_contents($file_tmp);
                $content = chunk_split(base64_encode($content));
                
                $body .= "--$boundary\r\n";
                $body .= "Content-Type: $file_type; name=\"$file_name\"\r\n";
                $body .= "Content-Transfer-Encoding: base64\r\n";
                $body .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n\r\n";
                $body .= $content . "\r\n\r\n";
            }
        }
    }
} elseif (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
    // Single file fallback (if frontend doesn't use [])
    $file_tmp = $_FILES['attachment']['tmp_name'];
    $file_name = $_FILES['attachment']['name'];
    $file_type = $_FILES['attachment']['type'];
    
    if (is_uploaded_file($file_tmp)) {
        $content = file_get_contents($file_tmp);
        $content = chunk_split(base64_encode($content));
        
        $body .= "--$boundary\r\n";
        $body .= "Content-Type: $file_type; name=\"$file_name\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n\r\n";
        $body .= $content . "\r\n\r\n";
    }
}

$body .= "--$boundary--";

// Send the email
$mail_sent = mail($to, $subject, $body, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send email via mail() function.']);
}
?>
