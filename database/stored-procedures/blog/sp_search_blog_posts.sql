CREATE OR ALTER PROCEDURE [dbo].[sp_search_blog_posts]
    @category NVARCHAR(50) = NULL,
    @team_id INT = NULL,
    @page INT = 1,
    @per_page INT = 12
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @offset INT = (@page - 1) * @per_page;

    SELECT
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.category,
        bp.tags,
        bp.published_at,
        bp.created_at,
        t.id AS team_id,
        t.name AS team_name,
        t.slug AS team_slug,
        u.id AS author_id,
        u.name AS author_name,
        COUNT(*) OVER() AS total_count
    FROM blog_posts bp
    INNER JOIN teams t ON t.id = bp.team_id
    INNER JOIN users u ON u.id = bp.user_id
    WHERE bp.deleted_at IS NULL
        AND bp.is_published = 1
        AND (@category IS NULL OR bp.category = @category)
        AND (@team_id IS NULL OR bp.team_id = @team_id)
    ORDER BY bp.published_at DESC
    OFFSET @offset ROWS
    FETCH NEXT @per_page ROWS ONLY;
END;
