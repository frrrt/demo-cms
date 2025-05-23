import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import Users from "@/collections/Users";
import Media from "./collections/Media";
import { slateEditor } from "@payloadcms/richtext-slate";
import Pages from "./collections/Pages";
import UIStrings from "./collections/UIString";
import { DEFAULT_LOCALE, LOCALES } from "./const/locales";
import UiStringMedia from "./collections/UIStringMedia";
import { endpointTranslateString } from "./custom-endpoints/translateString/endpointTranslateString";
import Settings from "./collections/Settings";
import { endpointGenerateAltText } from "./custom-endpoints/alt-text/endpointGenerateAltText";
import Authors from "./collections/Authors";
import Comments from "./collections/Comments";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: "@/components/Logo",
        Icon: "@/components/Icon",
      },
    },
  },
  localization: {
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  collections: [Authors, Users, Media, Pages, Comments, UIStrings, UiStringMedia],
  globals: [Settings],
  editor: slateEditor({}),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  cors: ["http://localhost:3000", "https://demo-frontend-sigma.vercel.app"],
  sharp,
  plugins: [
    s3Storage({
      // Both collections use the same S3 bucket, generally not a problem except for uploading the exact same file through both collections.
      // In that case, if one collection deletes the file, it will be deleted from the S3 bucket, and the other collection will contain
      // stale data. Should be fixed eventually.
      collections: {
        media: true,
        "ui-string-media": true,
      },
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        region: process.env.S3_REGION,
      },
    }),
  ],
  endpoints: [endpointTranslateString, endpointGenerateAltText],
  graphQL: {
    disable: true,
  },
});
