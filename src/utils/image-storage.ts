import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import path = require("path");
import { from, Observable, of, switchMap } from "rxjs";

type validFileExtension = "png" | "jpg" | "jpeg";
type validMimeType = "image/png" | "image/jpg" | "image/jpeg";

const FileType = require("file-type");

const fs = require("fs");

const validFileExtensions: validFileExtension[] = ["png", "jpg", "jpeg"];
const validMimeTypes: validMimeType[] = [
  "image/png",
  "image/jpg",
  "image/jpeg",
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: "./uploads",
    filename: (req, file, callback) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;

      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype)
      ? callback(null, true)
      : callback(null, false);
  },
};

export const isFileExtensitonSafe = (
  fullFilePath: string,
): Observable<boolean> => {
  return from(FileType.fromFile(fullFilePath)).pipe(
    switchMap(
      (fileExtensionAndMimeType: {
        ext: validFileExtension;
        mime: validMimeType;
      }) => {
        if (!fileExtensionAndMimeType) {
          return of(false);
        }

        const isFileTypeLegit = validFileExtensions.includes(
          fileExtensionAndMimeType.ext,
        );
        const isMimeTypeLegit = validMimeTypes.includes(
          fileExtensionAndMimeType.mime,
        );
        const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
        return of(isFileLegit);
      },
    ),
  );
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    console.error(err);
  }
};
