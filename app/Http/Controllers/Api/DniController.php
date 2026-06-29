<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DniLookupService;
use Illuminate\Http\Request;

class DniController extends Controller
{
    public function __construct(
        private readonly DniLookupService $dniLookup,
    ) {}

    public function lookup(Request $request)
    {
        $request->validate([
            'dni' => ['required', 'string', 'size:8', 'regex:/^[0-9]{8}$/'],
        ]);

        $result = $this->dniLookup->lookup($request->input('dni'));

        return response()->json($result);
    }
}
