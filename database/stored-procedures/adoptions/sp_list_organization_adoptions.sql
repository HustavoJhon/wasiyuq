CREATE OR ALTER PROCEDURE [dbo].[sp_list_organization_adoptions]
    @team_id INT,
    @status NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        a.id,
        a.status,
        a.created_at,
        p.id AS pet_id,
        p.name AS pet_name,
        p.slug AS pet_slug,
        adopter.id AS adopter_id,
        adopter.name AS adopter_name,
        adopter.email AS adopter_email
    FROM adoptions a
    INNER JOIN pets p ON p.id = a.pet_id
    INNER JOIN users adopter ON adopter.id = a.user_id
    WHERE a.team_id = @team_id AND a.deleted_at IS NULL
        AND (@status IS NULL OR a.status = @status)
    ORDER BY a.created_at DESC;
END;
