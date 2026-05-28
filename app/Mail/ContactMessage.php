<?php

namespace App\Mail;

use App\Models\ContactRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactRequest $request,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nuevo mensaje de contacto: ' . $this->request->subject,
            replyTo: [$this->request->email, $this->request->name],
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.contact-message',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
