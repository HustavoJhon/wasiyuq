CREATE OR ALTER PROCEDURE [dbo].[sp_get_organization_pets]
    @team_id INT,
    @status NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

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
        p.created_at
    FROM pets p
    WHERE p.team_id = @team_id
        AND p.deleted_at IS NULL
        AND (@status IS NULL OR p.status = @status)
    ORDER BY p.created_at DESC;
END;
