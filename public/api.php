<?php

ini_set('always_populate_raw_post_data', 0);

$content = file_get_contents('../config/config.json');

$config = json_decode($content, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo 'Invalid config';
    exit;
}

$endpoint = $config['endpoint'];

$fp = fopen("php://input", 'r+');

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $endpoint);
curl_setopt($curl, CURLOPT_CONNECTTIMEOUT_MS, 2500);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, stream_get_contents($fp));

$result = curl_exec($curl);

$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$errno  = curl_errno($curl);
$error  = curl_error($curl);
curl_close($curl);

echo $result;
