CREATE OR ALTER PROCEDURE [dbo].[sp_get_blog_post_detail]
    @slug NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.content,
        bp.cover_image,
        bp.category,
        bp.tags,
        bp.published_at,
        bp.created_at,
        bp.updated_at,
        t.id AS team_id,
        t.name AS team_name,
        t.slug AS team_slug,
        t.logo AS team_logo,
        t.city,
        t.state,
        u.id AS author_id,
        u.name AS author_name
    FROM blog_posts bp
    INNER JOIN teams t ON t.id = bp.team_id
    INNER JOIN users u ON u.id = bp.user_id
    WHERE bp.slug = @slug AND bp.deleted_at IS NULL;
END;
