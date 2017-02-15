<?php

$r = [];


$fp = fopen("php://input", 'r+');

$data = json_decode(stream_get_contents($fp), true);
switch ($data['action']) {
    case 'getRevisionList':
        $r = [
            [
                'name' => 'rev1',
                'id' => 1
            ],
            [
                'name' => 'rev2',
                'id' => 2
            ],
            [
                'name' => 'rev3',
                'id' => 3
            ]
        ];
        break;
    case 'getRevisionById':
        $r = [
            'opt1'=>'active',
            'opt2'=>'Sergey MIkheev',
            'idInReq' => $data['data']['revId']
        ];
        break;
}

echo json_encode(['success' => true, 'payload' => $r]);
