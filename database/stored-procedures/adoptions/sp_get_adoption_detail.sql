CREATE OR ALTER PROCEDURE [dbo].[sp_get_adoption_detail]
    @adoption_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        a.id,
        a.status,
        a.motivation,
        a.experience_with_pets,
        a.has_yard,
        a.housing_type,
        a.family_composition,
        a.notes,
        a.created_at,
        a.reviewed_at,
        p.id AS pet_id,
        p.name AS pet_name,
        p.slug AS pet_slug,
        p.species,
        p.breed,
        p.photos AS pet_photos,
        adopter.id AS adopter_id,
        adopter.name AS adopter_name,
        adopter.email AS adopter_email,
        reviewer.id AS reviewer_id,
        reviewer.name AS reviewer_name,
        t.id AS team_id,
        t.name AS team_name,
        t.slug AS team_slug
    FROM adoptions a
    INNER JOIN pets p ON p.id = a.pet_id
    INNER JOIN users adopter ON adopter.id = a.user_id
    LEFT JOIN users reviewer ON reviewer.id = a.reviewed_by
    INNER JOIN teams t ON t.id = a.team_id
    WHERE a.id = @adoption_id AND a.deleted_at IS NULL;
END;
