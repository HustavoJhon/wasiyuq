<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 14px; color: #1a1a1a; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { color: #2D6A4F; font-size: 24px; margin-bottom: 4px; }
        .header p { color: #6b7280; font-size: 14px; }
        .certificate { border: 2px solid #2D6A4F; padding: 40px; border-radius: 12px; }
        .content { margin: 30px 0; line-height: 1.8; }
        .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature-box { text-align: center; }
        .signature-line { width: 200px; border-top: 1px solid #333; margin-top: 50px; padding-top: 8px; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <h1>Certificado de Adopción</h1>
            <p>Wasiyuq - Plataforma de Adopción Responsable</p>
        </div>

        <div class="content">
            <p>Por medio del presente, se certifica que <strong>{{ $adoption->adopter->name }}</strong> ha adoptado a <strong>{{ $adoption->pet->name }}</strong> 
            ({{ $adoption->pet->species }}@if($adoption->pet->breed) - {{ $adoption->pet->breed }}@endif), 
            bajo la supervisión de la entidad <strong>{{ $adoption->team->name }}</strong>.</p>

            <p>Este certificado se expide como constancia del compromiso de adopción responsable, 
            habiendo completado satisfactoriamente el proceso de evaluación y seguimiento correspondiente.</p>

            <p>Fecha de emisión: {{ now()->format('d/m/Y') }}</p>
        </div>

        <div class="signatures">
            <div class="signature-box">
                <div class="signature-line">{{ $adoption->adopter->name }}</div>
                <p style="font-size: 12px; color: #6b7280;">Adoptante</p>
            </div>
            <div class="signature-box">
                <div class="signature-line">{{ $adoption->team->name }}</div>
                <p style="font-size: 12px; color: #6b7280;">Entidad responsable</p>
            </div>
        </div>

        <div class="footer">
            <p>Wasiyuq © {{ date('Y') }} - Todos los derechos reservados</p>
        </div>
    </div>
</body>
</html>
