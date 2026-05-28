CREATE OR ALTER PROCEDURE [dbo].[sp_get_pet_detail]
    @slug NVARCHAR(255)
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
        p.description,
        p.medical_notes,
        p.status,
        p.photos,
        p.created_at,
        p.updated_at,
        t.id AS team_id,
        t.name AS team_name,
        t.slug AS team_slug,
        t.bio AS team_bio,
        t.logo AS team_logo,
        t.website AS team_website,
        t.phone AS team_phone,
        t.city,
        t.state
    FROM pets p
    INNER JOIN teams t ON t.id = p.team_id
    WHERE p.slug = @slug AND p.deleted_at IS NULL;
END;
