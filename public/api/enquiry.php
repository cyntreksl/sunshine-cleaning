<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function wants_json(): bool {
    return str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
}

function respond(int $status, bool $ok, string $message, array $fieldErrors = []): never {
    http_response_code($status);
    if (!wants_json() && $ok) {
        header('Location: /thank-you/', true, 303);
        exit;
    }
    header('Content-Type: application/json; charset=utf-8');
    $payload = ['ok' => $ok, 'message' => $message];
    if ($fieldErrors !== []) $payload['fieldErrors'] = $fieldErrors;
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Please submit the enquiry form.');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $requestHost = strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]);
    if ($originHost === '' || !hash_equals($requestHost, $originHost)) {
        respond(403, false, 'This enquiry could not be verified. Please reload the page and try again.');
    }
}

if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond(200, true, 'Thank you. Your enquiry has been received.');
}

$startedAt = filter_input(INPUT_POST, 'startedAt', FILTER_VALIDATE_INT);
if ($startedAt && ((int) floor(microtime(true) * 1000) - $startedAt) < 1800) {
    respond(429, false, 'Please wait a moment before sending the form.');
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateKey = getenv('SUNSHINE_RATE_LIMIT_KEY') ?: 'sunshine-cleaning-form-v1';
$ipHash = hash_hmac('sha256', $ip, $rateKey);
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'sunshine-rate-' . $ipHash . '.json';
$now = time();
$window = 900;
$attempts = [];
$handle = fopen($rateFile, 'c+');
if ($handle !== false && flock($handle, LOCK_EX)) {
    $raw = stream_get_contents($handle);
    $decoded = $raw ? json_decode($raw, true) : [];
    if (is_array($decoded)) $attempts = array_values(array_filter($decoded, fn($time) => is_int($time) && $time > $now - $window));
    if (count($attempts) >= 5) {
        flock($handle, LOCK_UN); fclose($handle);
        respond(429, false, 'Too many enquiries have been sent from this connection. Please try again later or call us.');
    }
    $attempts[] = $now;
    ftruncate($handle, 0); rewind($handle); fwrite($handle, json_encode($attempts)); fflush($handle); flock($handle, LOCK_UN); fclose($handle);
}

function value(string $key, int $limit): string {
    $input = trim((string) ($_POST[$key] ?? ''));
    return mb_substr($input, 0, $limit + 1);
}

$data = [
    'name' => value('name', 80), 'email' => value('email', 160), 'phone' => value('phone', 30),
    'postcode' => strtoupper(value('postcode', 12)), 'service' => value('service', 60),
    'propertyType' => value('propertyType', 50), 'frequency' => value('frequency', 50),
    'preferredDate' => value('preferredDate', 10), 'message' => value('message', 2000),
];
$errors = [];
foreach (['name', 'email', 'phone', 'postcode', 'service', 'propertyType', 'frequency', 'message'] as $required) {
    if ($data[$required] === '') $errors[$required] = 'Please complete this field.';
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Enter a valid email address.';
if (!preg_match('/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i', $data['postcode'])) $errors['postcode'] = 'Enter a valid UK postcode.';
if (!preg_match('/^[0-9+()\s.\-]{7,30}$/', $data['phone'])) $errors['phone'] = 'Enter a valid telephone number.';
if (($data['preferredDate'] !== '') && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['preferredDate'])) $errors['preferredDate'] = 'Enter a valid date.';
if (($_POST['privacyAccepted'] ?? '') !== 'yes') $errors['privacyAccepted'] = 'Please acknowledge the privacy notice.';
foreach ($data as $key => $entry) {
    if (str_contains($entry, "\r") || str_contains($entry, "\n") && $key !== 'message') $errors[$key] = 'This field contains invalid characters.';
}
$limits = ['name'=>80,'email'=>160,'phone'=>30,'postcode'=>12,'service'=>60,'propertyType'=>50,'frequency'=>50,'preferredDate'=>10,'message'=>2000];
foreach ($limits as $key => $limit) if (mb_strlen($data[$key]) > $limit) $errors[$key] = 'This field is too long.';
if ($errors !== []) respond(422, false, 'Please check the highlighted fields.', $errors);

$subject = 'Website cleaning enquiry: ' . preg_replace('/[^A-Za-z0-9 &\-]/', '', $data['service']);
$body = "New Sunshine Cleaning website enquiry\n\n";
foreach (['name'=>'Name','email'=>'Email','phone'=>'Phone','postcode'=>'Postcode','service'=>'Service','propertyType'=>'Property type','frequency'=>'Frequency','preferredDate'=>'Preferred date','message'=>'Message'] as $key => $label) {
    $body .= $label . ": " . $data[$key] . "\n";
}
$headers = [
    'From: Sunshine Cleaning website <website@sunshinecleaning.uk>',
    'Reply-To: ' . $data['name'] . ' <' . $data['email'] . '>',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = getenv('SUNSHINE_FORM_TEST_MODE') === '1' ? true : mail('info@sunshinecleaning.uk', $subject, $body, implode("\r\n", $headers));
if (!$sent) respond(500, false, 'We could not send your enquiry just now. Please call, WhatsApp or email us instead.');
respond(200, true, 'Thank you. Your enquiry has been sent to Sunshine Cleaning.');
