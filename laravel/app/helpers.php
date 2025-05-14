<?php

use Illuminate\Http\JsonResponse;

function api_response(
    bool $success = true,
    mixed $data = null,
    string $message = '',
    array $errors = [],
    array $meta = [],
    int $statusCode = 200
): JsonResponse {
    $response = [
        'status' => $success ? 'success' : 'error',
        'message' => $message,
        'data' => $data,
    ];

    if (!$success && !empty($errors)) {
        $response['errors'] = $errors;
    }

    if (!empty($meta)) {
        $response['meta'] = $meta;
    }

    return response()->json($response, $statusCode);
}
