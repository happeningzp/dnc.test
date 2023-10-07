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
    public function responseSuccess($data = [], $status = 200): \Illuminate\Http\JsonResponse
    {
        $response = [
            'success' => true,
        ];

        if (!empty($data)) {
            $response['data'] = $data;
        }


        return response()->json($response, $status);
    }

    public function responseError($errors = [], $status = 403)
    {
        $response = [
            'success' => false,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }


        return response()->json($response, $status);
    }
}
