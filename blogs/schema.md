model User {
id String @id @default(cuid())
name String?
email String? @unique
emailVerified DateTime?
image String?
role UserRole @default(USER)
repositories Repository[]
}

model Repository {
id String @id @default(cuid())
githubId Int @unique
name String
fullName String
description String?
status RepositoryStatus @default(PENDING)
owner String
url String
userId String
user User @relation(fields: [userId], references: [id])
chunks RepositoryChunk[]
}

model RepositoryChunk {
id String @id @default(cuid())
repositoryId String
repository Repository @relation(fields: [repositoryId], references: [id])
content String
type String
filepath String
embeddings Float[]
keywords String[]
}

enum UserRole {
GUEST,  
 USER,  
 ADMIN  
}

enum RepositoryStatus {
PENDING
SUCCESS
}
