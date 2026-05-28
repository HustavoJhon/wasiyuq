<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Acta de Adopción</title>
    <style>
        body { font-family: sans-serif; padding: 40px; }
        h1 { text-align: center; color: #2D6A4F; margin-bottom: 30px; }
        .info { margin-bottom: 20px; }
        .info dt { font-weight: bold; margin-top: 10px; }
        .info dd { margin-left: 0; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
        .signature { margin-top: 60px; display: flex; justify-content: space-between; }
        .signature div { text-align: center; width: 45%; }
        .signature .line { border-top: 1px solid #333; margin-top: 40px; padding-top: 8px; }
    </style>
</head>
<body>
    <h1>Acta de Adopción Responsable</h1>
    <p style="text-align: center;">Wasiyuq — Plataforma de Adopción Responsable</p>
    <p style="text-align: center;">Cusco, Perú — {{ $date }}</p>

    <div class="info">
        <h3>Datos de la mascota</h3>
        <dl>
            <dt>Nombre</dt>
            <dd>{{ $pet->name }}</dd>
            <dt>Especie</dt>
            <dd>{{ $pet->species }}</dd>
            <dt>Raza</dt>
            <dd>{{ $pet->breed ?? 'No especificada' }}</dd>
        </dl>
    </div>

    <div class="info">
        <h3>Datos del adoptante</h3>
        <dl>
            <dt>Nombre</dt>
            <dd>{{ $adopter->name }}</dd>
            <dt>Email</dt>
            <dd>{{ $adopter->email }}</dd>
        </dl>
    </div>

    <div class="info">
        <h3>Entidad responsable</h3>
        <dl>
            <dt>Nombre</dt>
            <dd>{{ $entity->name }}</dd>
        </dl>
    </div>

    <p style="margin-top: 30px;">
        Se deja constancia de la adopción responsable de la mascota arriba mencionada,
        comprometiéndose el adoptante a brindar los cuidados necesarios para su bienestar.
    </p>

    <div class="signature">
        <div><div class="line">Adoptante</div></div>
        <div><div class="line">Entidad responsable</div></div>
    </div>

    <div class="footer">
        <p>Documento generado por Wasiyuq — {{ $date }}</p>
    </div>
</body>
</html>
