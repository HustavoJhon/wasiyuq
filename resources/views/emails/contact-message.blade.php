<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Nuevo mensaje</title></head>
<body style="font-family:sans-serif;line-height:1.6;color:#1a1a2e;max-width:600px;margin:0 auto;padding:20px">
  <div style="border-bottom:3px solid #2D6A4F;padding-bottom:12px;margin-bottom:24px">
    <h1 style="margin:0;font-size:20px;color:#2D6A4F">Nuevo mensaje de contacto</h1>
  </div>

  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:8px 0;font-weight:700;color:#555;width:100px">Nombre</td><td style="padding:8px 0">{{ $request->name }}</td></tr>
    <tr><td style="padding:8px 0;font-weight:700;color:#555">Email</td><td style="padding:8px 0"><a href="mailto:{{ $request->email }}">{{ $request->email }}</a></td></tr>
    <tr><td style="padding:8px 0;font-weight:700;color:#555">Asunto</td><td style="padding:8px 0">{{ $request->subject }}</td></tr>
    @if($request->pet)
    <tr><td style="padding:8px 0;font-weight:700;color:#555">Mascota</td><td style="padding:8px 0"><a href="{{ url('/mascotas/' . $request->pet->slug) }}">{{ $request->pet->name }}</a> ({{ $request->pet->species }}{{ $request->pet->breed ? ' - ' . $request->pet->breed : '' }})</td></tr>
    @endif
    <tr><td style="padding:8px 0;font-weight:700;color:#555;vertical-align:top">Mensaje</td><td style="padding:8px 0;white-space:pre-wrap">{{ $request->message }}</td></tr>
  </table>

  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999">
    Enviado desde wasiyuq.pe
  </div>
</body>
</html>
