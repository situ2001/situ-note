-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "category" TEXT NOT NULL DEFAULT '默认',
    "description" TEXT NOT NULL DEFAULT '',
    "markdownContent" TEXT NOT NULL,
    "comment" BOOLEAN NOT NULL DEFAULT true,
    "filename" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ImageMetaData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    CONSTRAINT "ImageMetaData_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
