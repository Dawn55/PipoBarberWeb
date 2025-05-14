BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(50) NOT NULL,
    [surname] VARCHAR(50) NOT NULL,
    [phoneNumber] NCHAR(11) NOT NULL,
    [email] VARCHAR(50) NOT NULL,
    [password] VARCHAR(max),
    [isAdmin] BIT NOT NULL CONSTRAINT [Users_isAdmin_df] DEFAULT 0,
    [isGuest] BIT NOT NULL CONSTRAINT [Users_isGuest_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Appointments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [description] VARCHAR(500) NOT NULL,
    [date] DATE NOT NULL,
    [time] TIME NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Appointments_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [status] INT NOT NULL CONSTRAINT [Appointments_status_df] DEFAULT 0,
    [token] VARCHAR(100),
    CONSTRAINT [PK_Appointments] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Appointments_token_key] UNIQUE NONCLUSTERED ([token])
);

-- CreateTable
CREATE TABLE [dbo].[AppointmentMessages] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appointmentId] INT NOT NULL,
    [senderId] INT NOT NULL,
    [text] VARCHAR(500) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppointmentMessages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_AppointmentMessages] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Messages] (
    [id] INT NOT NULL IDENTITY(1,1),
    [sender_id] INT NOT NULL,
    [receiver_id] INT NOT NULL,
    [title] VARCHAR(50) NOT NULL,
    [description] VARCHAR(500) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Messages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK_Messages] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Appointments] ADD CONSTRAINT [FK_Appointments_Users] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppointmentMessages] ADD CONSTRAINT [FK_AppointmentMessages_Appointments] FOREIGN KEY ([appointmentId]) REFERENCES [dbo].[Appointments]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppointmentMessages] ADD CONSTRAINT [FK_AppointmentMessages_Users] FOREIGN KEY ([senderId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [FK_Messages_Users] FOREIGN KEY ([sender_id]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messages] ADD CONSTRAINT [FK_Messages_Users1] FOREIGN KEY ([receiver_id]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
