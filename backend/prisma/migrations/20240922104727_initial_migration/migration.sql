BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [user_id] NVARCHAR(255) NOT NULL,
    [fullname] NVARCHAR(255) NOT NULL,
    [id_number] INT NOT NULL,
    [country] NVARCHAR(255) NOT NULL,
    [county] NVARCHAR(255) NOT NULL,
    [ward] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [phone_number] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'seeker',
    [profile_image] NVARCHAR(1000) NOT NULL,
    [isDeleted] BIT NOT NULL CONSTRAINT [User_isDeleted_df] DEFAULT 0,
    [isWelcomed] BIT NOT NULL CONSTRAINT [User_isWelcomed_df] DEFAULT 0,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([user_id]),
    CONSTRAINT [User_user_id_key] UNIQUE NONCLUSTERED ([user_id]),
    CONSTRAINT [User_id_number_key] UNIQUE NONCLUSTERED ([id_number]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [User_phone_number_key] UNIQUE NONCLUSTERED ([phone_number])
);

-- CreateTable
CREATE TABLE [dbo].[Recovery] (
    [recovery_id] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [verification_code] INT NOT NULL,
    [isRecovered] BIT NOT NULL CONSTRAINT [Recovery_isRecovered_df] DEFAULT 0,
    CONSTRAINT [Recovery_pkey] PRIMARY KEY CLUSTERED ([recovery_id]),
    CONSTRAINT [Recovery_recovery_id_key] UNIQUE NONCLUSTERED ([recovery_id]),
    CONSTRAINT [Recovery_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Recovery_verification_code_key] UNIQUE NONCLUSTERED ([verification_code])
);

-- CreateTable
CREATE TABLE [dbo].[IndividualDetails] (
    [individual_id] NVARCHAR(255) NOT NULL,
    [seeker_id] NVARCHAR(255) NOT NULL,
    [service] NVARCHAR(255) NOT NULL,
    [certification_image] NVARCHAR(255) NOT NULL,
    [yoe] INT NOT NULL CONSTRAINT [IndividualDetails_yoe_df] DEFAULT 0,
    [company_names] NVARCHAR(1000),
    CONSTRAINT [IndividualDetails_pkey] PRIMARY KEY CLUSTERED ([individual_id]),
    CONSTRAINT [IndividualDetails_individual_id_key] UNIQUE NONCLUSTERED ([individual_id])
);

-- CreateTable
CREATE TABLE [dbo].[Job] (
    [job_id] NVARCHAR(255) NOT NULL,
    [job_name] NVARCHAR(255) NOT NULL,
    [owner_id] NVARCHAR(255) NOT NULL,
    [positions] NVARCHAR(1000),
    [images] NVARCHAR(1000),
    [country] NVARCHAR(255) NOT NULL,
    [county] NVARCHAR(255) NOT NULL,
    [ward] NVARCHAR(255) NOT NULL,
    [short_description] NVARCHAR(255) NOT NULL,
    [long_description] NVARCHAR(255) NOT NULL,
    [start_date] NVARCHAR(1000) NOT NULL,
    [duration] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Job_pkey] PRIMARY KEY CLUSTERED ([job_id]),
    CONSTRAINT [Job_job_id_key] UNIQUE NONCLUSTERED ([job_id]),
    CONSTRAINT [Job_owner_id_key] UNIQUE NONCLUSTERED ([owner_id])
);

-- CreateTable
CREATE TABLE [dbo].[Position] (
    [position_id] NVARCHAR(255) NOT NULL,
    [job_id] NVARCHAR(255) NOT NULL,
    [frequency] NVARCHAR(1000) NOT NULL,
    [per_frequency] INT NOT NULL,
    [price] INT NOT NULL,
    CONSTRAINT [Position_pkey] PRIMARY KEY CLUSTERED ([position_id]),
    CONSTRAINT [Position_position_id_key] UNIQUE NONCLUSTERED ([position_id]),
    CONSTRAINT [Position_job_id_key] UNIQUE NONCLUSTERED ([job_id])
);

-- CreateTable
CREATE TABLE [dbo].[Messages] (
    [message_id] NVARCHAR(255) NOT NULL,
    [sender_id] NVARCHAR(255) NOT NULL,
    [receiver_id] NVARCHAR(255) NOT NULL,
    [content] NVARCHAR(255) NOT NULL,
    [isRead] BIT NOT NULL CONSTRAINT [Messages_isRead_df] DEFAULT 0,
    [sent_date] NVARCHAR(1000) NOT NULL,
    [job_id] NVARCHAR(1000) NOT NULL,
    [isGroup] BIT NOT NULL CONSTRAINT [Messages_isGroup_df] DEFAULT 0,
    [isDeleted] BIT NOT NULL CONSTRAINT [Messages_isDeleted_df] DEFAULT 0,
    CONSTRAINT [Messages_pkey] PRIMARY KEY CLUSTERED ([message_id]),
    CONSTRAINT [Messages_message_id_key] UNIQUE NONCLUSTERED ([message_id]),
    CONSTRAINT [Messages_sender_id_key] UNIQUE NONCLUSTERED ([sender_id]),
    CONSTRAINT [Messages_receiver_id_key] UNIQUE NONCLUSTERED ([receiver_id]),
    CONSTRAINT [Messages_job_id_key] UNIQUE NONCLUSTERED ([job_id])
);

-- CreateTable
CREATE TABLE [dbo].[Wishlist] (
    [wishlist_id] NVARCHAR(255) NOT NULL,
    [user_id] NVARCHAR(255) NOT NULL,
    [job_id] NVARCHAR(255) NOT NULL,
    CONSTRAINT [Wishlist_pkey] PRIMARY KEY CLUSTERED ([wishlist_id]),
    CONSTRAINT [Wishlist_wishlist_id_key] UNIQUE NONCLUSTERED ([wishlist_id]),
    CONSTRAINT [Wishlist_user_id_key] UNIQUE NONCLUSTERED ([user_id]),
    CONSTRAINT [Wishlist_job_id_key] UNIQUE NONCLUSTERED ([job_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Job] ADD CONSTRAINT [Job_owner_id_fkey] FOREIGN KEY ([owner_id]) REFERENCES [dbo].[User]([user_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Job] ADD CONSTRAINT [Job_job_id_fkey] FOREIGN KEY ([job_id]) REFERENCES [dbo].[Position]([job_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Wishlist] ADD CONSTRAINT [Wishlist_job_id_fkey] FOREIGN KEY ([job_id]) REFERENCES [dbo].[Job]([job_id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
