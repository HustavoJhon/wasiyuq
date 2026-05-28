CREATE OR ALTER PROCEDURE [dbo].[sp_search_pets]
    @species NVARCHAR(50) = NULL,
    @size NVARCHAR(50) = NULL,
    @gender NVARCHAR(50) = NULL,
    @status NVARCHAR(50) = 'available',
    @search NVARCHAR(100) = NULL,
    @page INT = 1,
    @per_page INT = 12
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @offset INT = (@page - 1) * @per_page;

    SELECT
        p.id,
        p.name,
        p.slug,
        p.species,
        p.breed,
        p.age_years,
        p.age_months,
        p.gender,
        p.size,
        p.color,
        p.status,
        p.photos,
        p.created_at,
        t.id AS team_id,
        t.name AS team_name,
        t.slug AS team_slug,
        t.city,
        t.state,
        COUNT(*) OVER() AS total_count
    FROM pets p
    INNER JOIN teams t ON t.id = p.team_id
    WHERE p.deleted_at IS NULL
        AND (@species IS NULL OR p.species = @species)
        AND (@size IS NULL OR p.size = @size)
        AND (@gender IS NULL OR p.gender = @gender)
        AND (@status IS NULL OR p.status = @status)
        AND (@search IS NULL OR p.name LIKE '%' + @search + '%' OR p.breed LIKE '%' + @search + '%')
    ORDER BY p.created_at DESC
    OFFSET @offset ROWS
    FETCH NEXT @per_page ROWS ONLY;
END;
