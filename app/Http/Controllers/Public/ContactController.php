<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessage;
use App\Models\ContactRequest;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $pet = null;

        if ($request->query('pet')) {
            $pet = Pet::query()
                ->where('slug', $request->query('pet'))
                ->where('status', 'available')
                ->first(['id', 'name', 'slug', 'species', 'breed']);
        }

        return Inertia::render('Public/Contact', [
            'selectedPet' => $pet,
            'seo' => [
                'title' => 'Contacto',
                'description' => 'Contáctanos para adoptar, registrar tu organización o reportar un problema. Estamos en Cusco, Perú.',
                'url' => url('/contacto'),
                'type' => 'website',
            ],
        ]);
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'pet' => 'nullable|string|max:255|exists:pets,slug',
        ]);

        $pet = null;
        if (!empty($data['pet'])) {
            $pet = Pet::where('slug', $data['pet'])->first();
        }

        $contactRequest = ContactRequest::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => $data['subject'],
            'message' => $data['message'],
            'pet_id' => $pet?->id,
        ]);

        Mail::to(config('mail.from.address'))
            ->send(new ContactMessage($contactRequest));

        return back()->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Mensaje enviado correctamente. Te responderemos pronto.',
            ],
        ]);
    }
}
