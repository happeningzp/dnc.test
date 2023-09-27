<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BaseController extends Controller
{
    /**
     * @param $message
     * @param $data
     * @param $status
     * @return \Illuminate\Http\JsonResponse
     */
    public function responseSuccess($message, $data = [], $status = 200): \Illuminate\Http\JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        if(!empty($data))
            $response['data'] = $data;

        return response()->json($response, $status);
    }

    public function responseError($message, $errors = [], $status = 403)
    {
        $response = [
            'success' => false,
            'message' => $message
        ];

        if(!empty($errors))
            $response['errors'] = $errors;

        return response()->json($response, $status);
    }
}
