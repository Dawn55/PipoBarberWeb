/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Appointments` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Appointments] ADD [token] VARCHAR(100);

-- CreateIndex
ALTER TABLE [dbo].[Appointments] ADD CONSTRAINT [Appointments_token_key] UNIQUE NONCLUSTERED ([token]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
