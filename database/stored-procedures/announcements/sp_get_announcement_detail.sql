CREATE OR ALTER PROCEDURE [dbo].[sp_get_announcement_detail]
    @slug NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        a.id,
        a.title,
        a.slug,
        a.description,
        a.event_date,
        a.location,
        a.type,
        a.cover_image,
        a.is_published,
        a.published_at,
        a.created_at,
        a.updated_at,
        t.id AS team_id,
        t.name AS team_name,
        t.slug AS team_slug,
        t.logo AS team_logo,
        t.phone AS team_phone,
        t.city,
        t.state,
        u.id AS author_id,
        u.name AS author_name
    FROM announcements a
    INNER JOIN teams t ON t.id = a.team_id
    INNER JOIN users u ON u.id = a.user_id
    WHERE a.slug = @slug AND a.deleted_at IS NULL;
END;
