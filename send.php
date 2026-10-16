<?php
// Gillani Group website form handler: sends form submissions to admin@gillanigroup.eu
$to = 'admin@gillanigroup.eu';
$from = 'admin@gillanigroup.eu';

function clean($v, $max = 2000) {
    $v = is_string($v) ? trim($v) : '';
    $v = str_replace(["\r", "\0"], '', $v);
    return mb_substr($v, 0, $max);
}
function oneline($v, $max = 200) { return str_replace("\n", ' ', clean($v, $max)); }

$back = isset($_POST['back']) ? $_POST['back'] : '/contact.html';
if (!preg_match('#^/((ro|de)/)?[a-z]+\.html$#', $back)) { $back = '/contact.html'; }
$form = (isset($_POST['form']) && in_array($_POST['form'], ['contact', 'request'], true)) ? $_POST['form'] : 'contact';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . $back); exit; }
// spam trap: real visitors never fill this hidden field
if (!empty($_POST['website'])) { header('Location: ' . $back . '?sent=' . $form . '#f-' . $form); exit; }

$name    = oneline($_POST['name'] ?? '');
$email   = oneline($_POST['email'] ?? '');
$phone   = oneline($_POST['phone'] ?? '');
$company = oneline($_POST['company'] ?? '');
$message = clean($_POST['message'] ?? '');
$lang    = oneline($_POST['lang'] ?? 'en', 5);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || ($form === 'contact' && $message === '')) {
    header('Location: ' . $back . '?error=' . $form . '#f-' . $form); exit;
}

$lines = [];
if ($form === 'request') {
    $subject = 'Worker request: ' . ($company !== '' ? $company : $name);
    $lines[] = 'NEW WORKER REQUEST from gillanigroup.eu';
    $lines[] = 'Company: ' . $company;
    $lines[] = 'Contact person: ' . $name;
    $lines[] = 'Email: ' . $email;
    $lines[] = 'Phone: ' . $phone;
    $lines[] = 'Number of workers: ' . oneline($_POST['workers'] ?? '', 20);
    $lines[] = 'Roles: ' . oneline($_POST['roles'] ?? '');
    $lines[] = 'Location: ' . oneline($_POST['city'] ?? '');
    $lines[] = 'Start date: ' . oneline($_POST['start'] ?? '');
} else {
    $topic = oneline($_POST['topic'] ?? '');
    $subject = 'Website enquiry: ' . ($topic !== '' ? $topic : 'Contact');
    $lines[] = 'NEW ENQUIRY from gillanigroup.eu';
    $lines[] = 'Topic: ' . $topic;
    $lines[] = 'Name: ' . $name;
    $lines[] = 'Company: ' . $company;
    $lines[] = 'Email: ' . $email;
    $lines[] = 'Phone: ' . $phone;
}
$lines[] = 'Page language: ' . $lang;
$lines[] = '';
$lines[] = 'Message:';
$lines[] = $message;
$body = implode("\n", $lines);

$headers  = 'From: Gillani Group Website <' . $from . ">\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n";

$ok = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . $from);
header('Location: ' . $back . ($ok ? '?sent=' : '?error=') . $form . '#f-' . $form);
exit;
