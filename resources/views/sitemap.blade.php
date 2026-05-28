<?php echo '<'.'?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach ($static as $url)
    <url>
        <loc>{{ $url['loc'] }}</loc>
        <priority>{{ $url['priority'] }}</priority>
        <changefreq>{{ $url['changefreq'] }}</changefreq>
    </url>
    @endforeach

    @foreach ($pets as $pet)
    <url>
        <loc>{{ url('/mascotas/'.$pet->slug) }}</loc>
        <priority>0.7</priority>
        <changefreq>daily</changefreq>
        <lastmod>{{ $pet->updated_at->toW3cString() }}</lastmod>
    </url>
    @endforeach

    @foreach ($events as $event)
    <url>
        <loc>{{ url('/eventos/'.$event->slug) }}</loc>
        <priority>0.6</priority>
        <changefreq>weekly</changefreq>
        <lastmod>{{ $event->updated_at->toW3cString() }}</lastmod>
    </url>
    @endforeach

    @foreach ($posts as $post)
    <url>
        <loc>{{ url('/blog/'.$post->slug) }}</loc>
        <priority>0.7</priority>
        <changefreq>weekly</changefreq>
        <lastmod>{{ $post->updated_at->toW3cString() }}</lastmod>
    </url>
    @endforeach
</urlset>
