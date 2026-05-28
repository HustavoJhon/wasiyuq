CREATE OR ALTER PROCEDURE [dbo].[sp_search_announcements]
    @type NVARCHAR(50) = NULL,
    @team_id INT = NULL,
    @page INT = 1,
    @per_page INT = 12
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @offset INT = (@page - 1) * @per_page;

    SELECT
        a.id,
        a.title,
        a.slug,
        a.description,
        a.event_date,
        a.location,
        a.type,
        a.cover_image,
        a.published_at,
        a.created_at,
        t.id AS team_id,
        t.name AS team_name,
        t.slug AS team_slug,
        u.id AS author_id,
        u.name AS author_name,
        COUNT(*) OVER() AS total_count
    FROM announcements a
    INNER JOIN teams t ON t.id = a.team_id
    INNER JOIN users u ON u.id = a.user_id
    WHERE a.deleted_at IS NULL
        AND a.is_published = 1
        AND (@type IS NULL OR a.type = @type)
        AND (@team_id IS NULL OR a.team_id = @team_id)
    ORDER BY a.event_date DESC, a.created_at DESC
    OFFSET @offset ROWS
    FETCH NEXT @per_page ROWS ONLY;
END;
